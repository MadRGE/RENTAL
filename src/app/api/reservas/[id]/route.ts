import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { status } = await request.json();

    const reserva = await prisma.reservation.findUnique({
      where: { id: params.id },
    });

    if (!reserva) {
      return NextResponse.json(
        { error: "Reserva no encontrada" },
        { status: 404 }
      );
    }

    // Only admin can confirm, or user can cancel their own
    if (user.role !== "ADMIN" && reserva.userId !== user.userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (user.role !== "ADMIN" && status !== "CANCELLED") {
      return NextResponse.json(
        { error: "Solo podés cancelar tu reserva" },
        { status: 400 }
      );
    }

    const updated = await prisma.reservation.update({
      where: { id: params.id },
      data: { status },
      include: {
        equipment: { select: { name: true, brand: true } },
        user: { select: { name: true, email: true } },
        payment: true,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar la reserva" },
      { status: 500 }
    );
  }
}
