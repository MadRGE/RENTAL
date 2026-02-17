import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const equipo = await prisma.equipment.findUnique({
    where: { id: params.id },
  });

  if (!equipo) {
    return NextResponse.json(
      { error: "Equipo no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(equipo);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = getUserFromRequest(request);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const equipo = await prisma.equipment.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(equipo);
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar equipo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = getUserFromRequest(request);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    await prisma.equipment.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Error al eliminar equipo" },
      { status: 500 }
    );
  }
}
