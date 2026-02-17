import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(request: Request) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { reservationId, method, reference } = await request.json();

    const reserva = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { payment: true },
    });

    if (!reserva) {
      return NextResponse.json(
        { error: "Reserva no encontrada" },
        { status: 404 }
      );
    }

    if (reserva.payment) {
      return NextResponse.json(
        { error: "Esta reserva ya tiene un pago registrado" },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.create({
      data: {
        reservationId,
        amount: reserva.totalPrice,
        method: method || "CASH",
        reference: reference || null,
        status: "PENDING",
      },
    });

    // Auto-confirm reservation when payment is created
    await prisma.reservation.update({
      where: { id: reservationId },
      data: { status: "CONFIRMED" },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al procesar el pago" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const user = getUserFromRequest(request);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { paymentId, status } = await request.json();

    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status },
    });

    if (status === "COMPLETED") {
      await prisma.reservation.update({
        where: { id: payment.reservationId },
        data: { status: "CONFIRMED" },
      });
    }

    return NextResponse.json(payment);
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar el pago" },
      { status: 500 }
    );
  }
}
