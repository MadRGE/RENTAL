import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const where: Record<string, unknown> = {};
  if (category) where.category = category;

  const equipos = await prisma.equipment.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(equipos);
}

export async function POST(request: Request) {
  const user = getUserFromRequest(request);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const equipo = await prisma.equipment.create({ data });
    return NextResponse.json(equipo, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al crear equipo" },
      { status: 500 }
    );
  }
}
