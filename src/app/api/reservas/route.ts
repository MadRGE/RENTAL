import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const where =
    user.role === "ADMIN" ? {} : { userId: user.userId };

  const reservas = await prisma.reservation.findMany({
    where,
    include: {
      equipment: { select: { name: true, brand: true, image: true, category: true } },
      user: { select: { name: true, email: true, phone: true } },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reservas);
}

export async function POST(request: Request) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { equipmentId, startDate, endDate, notes, totalPrice } =
      await request.json();

    if (!equipmentId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Equipo, fecha de inicio y fecha de fin son requeridos" },
        { status: 400 }
      );
    }

    const equipment = await prisma.equipment.findUnique({
      where: { id: equipmentId },
    });

    if (!equipment) {
      return NextResponse.json(
        { error: "Equipo no encontrado" },
        { status: 404 }
      );
    }

    if (!equipment.available) {
      return NextResponse.json(
        { error: "Este equipo no está disponible" },
        { status: 400 }
      );
    }

    // Check for overlapping reservations
    const overlapping = await prisma.reservation.findFirst({
      where: {
        equipmentId,
        status: { in: ["PENDING", "CONFIRMED"] },
        OR: [
          {
            startDate: { lte: new Date(endDate) },
            endDate: { gte: new Date(startDate) },
          },
        ],
      },
    });

    if (overlapping) {
      return NextResponse.json(
        { error: "Ya existe una reserva para esas fechas" },
        { status: 400 }
      );
    }

    const reserva = await prisma.reservation.create({
      data: {
        userId: user.userId,
        equipmentId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice: totalPrice || 0,
        notes: notes || null,
      },
      include: {
        equipment: { select: { name: true, brand: true } },
      },
    });

    return NextResponse.json(reserva, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al crear la reserva" },
      { status: 500 }
    );
  }
}
