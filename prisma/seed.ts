import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.payment.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      name: "Admin DJ Rental",
      email: "admin@djrental.com",
      password: adminPassword,
      phone: "+54 11 9999-0000",
      role: "ADMIN",
    },
  });
  console.log("Admin created:", admin.email);

  // Create test client
  const clientPassword = await bcrypt.hash("cliente123", 10);
  const client = await prisma.user.create({
    data: {
      name: "Juan Pérez",
      email: "cliente@test.com",
      password: clientPassword,
      phone: "+54 11 1234-5678",
      role: "CLIENT",
    },
  });
  console.log("Client created:", client.email);

  // Create DJ equipment
  const equipos = await Promise.all([
    prisma.equipment.create({
      data: {
        name: "DDJ-1000",
        brand: "Pioneer DJ",
        description:
          "Controladora DJ profesional de 4 canales. La DDJ-1000 es la controladora más popular para DJs profesionales, con jog wheels de tamaño completo, pads de performance y efectos integrados. Compatible con Rekordbox.",
        category: "CONTROLLER",
        pricePerHour: 3500,
        pricePerDay: 18000,
        available: true,
        featured: true,
      },
    }),
    prisma.equipment.create({
      data: {
        name: "DDJ-FLX6",
        brand: "Pioneer DJ",
        description:
          "Controladora de 4 canales compatible con Rekordbox y Serato DJ Pro. Diseño compacto con Merge FX para transiciones creativas. Perfecta para DJs intermedios.",
        category: "CONTROLLER",
        pricePerHour: 2000,
        pricePerDay: 10000,
        available: true,
        featured: true,
      },
    }),
    prisma.equipment.create({
      data: {
        name: "CDJ-3000",
        brand: "Pioneer DJ",
        description:
          "Reproductor DJ multi-formato de nivel profesional. Pantalla táctil de 9 pulgadas, MPU de alto rendimiento y conectividad avanzada. El estándar de la industria en cabinas de DJ.",
        category: "CONSOLE",
        pricePerHour: 5000,
        pricePerDay: 28000,
        available: true,
        featured: true,
      },
    }),
    prisma.equipment.create({
      data: {
        name: "CDJ-2000NXS2",
        brand: "Pioneer DJ",
        description:
          "El reproductor multi-formato profesional más utilizado en clubs y eventos. Display a color, Pro DJ Link y soporte de audio Hi-Res.",
        category: "CONSOLE",
        pricePerHour: 4000,
        pricePerDay: 22000,
        available: true,
        featured: true,
      },
    }),
    prisma.equipment.create({
      data: {
        name: "DJM-900NXS2",
        brand: "Pioneer DJ",
        description:
          "Mixer DJ profesional de 4 canales con efectos avanzados, interfaz de audio de 64 bits y aisladores independientes por canal. El mixer más usado en clubs del mundo.",
        category: "MIXER",
        pricePerHour: 3000,
        pricePerDay: 16000,
        available: true,
        featured: true,
      },
    }),
    prisma.equipment.create({
      data: {
        name: "DDJ-400",
        brand: "Pioneer DJ",
        description:
          "Controladora de 2 canales perfecta para principiantes. Compacta, portátil y con todas las funciones esenciales para aprender a mezclar. Compatible con Rekordbox.",
        category: "CONTROLLER",
        pricePerHour: 1200,
        pricePerDay: 6000,
        available: true,
        featured: false,
      },
    }),
    prisma.equipment.create({
      data: {
        name: "Traktor Kontrol S4 MK3",
        brand: "Native Instruments",
        description:
          "Controladora DJ de 4 canales con jog wheels motorizados y pantallas a color integradas. Diseñada para Traktor Pro con control haptic drive.",
        category: "CONTROLLER",
        pricePerHour: 2500,
        pricePerDay: 13000,
        available: true,
        featured: false,
      },
    }),
    prisma.equipment.create({
      data: {
        name: "SC6000 Prime",
        brand: "Denon DJ",
        description:
          "Reproductor DJ profesional con pantalla táctil HD de 10.1 pulgadas, streaming de música integrado y motor de análisis avanzado. Almacenamiento SSD interno.",
        category: "CONSOLE",
        pricePerHour: 4500,
        pricePerDay: 25000,
        available: true,
        featured: true,
      },
    }),
    prisma.equipment.create({
      data: {
        name: "EV ELX200-15P",
        brand: "Electro-Voice",
        description:
          "Parlante activo de 15 pulgadas, 1200W de potencia. Ideal para eventos medianos a grandes. DSP integrado con presets de aplicación. Se alquila en pares.",
        category: "SPEAKER",
        pricePerHour: 2000,
        pricePerDay: 10000,
        available: true,
        featured: false,
      },
    }),
    prisma.equipment.create({
      data: {
        name: "QSC KW181",
        brand: "QSC",
        description:
          "Subwoofer activo de 18 pulgadas, 1000W. Respuesta de graves potente y profunda para complementar tu sistema de sonido. Ideal para fiestas y eventos.",
        category: "SPEAKER",
        pricePerHour: 2500,
        pricePerDay: 12000,
        available: true,
        featured: false,
      },
    }),
    prisma.equipment.create({
      data: {
        name: "Moving Head Beam 230W",
        brand: "Beamz",
        description:
          "Cabeza móvil beam de 230W con prisma rotativo, gobos y efectos de color. Perfecta para crear ambiente en fiestas y eventos. Se alquila por unidad.",
        category: "LIGHTING",
        pricePerHour: 1500,
        pricePerDay: 8000,
        available: true,
        featured: false,
      },
    }),
    prisma.equipment.create({
      data: {
        name: "Máquina de Humo 1500W",
        brand: "Antari",
        description:
          "Máquina de humo profesional con control DMX y mando inalámbrico. Incluye líquido para 4 horas de uso continuo. Ideal para complementar iluminación.",
        category: "OTHER",
        pricePerHour: 800,
        pricePerDay: 4000,
        available: true,
        featured: false,
      },
    }),
  ]);

  console.log(`${equipos.length} equipos created`);

  // Create some sample reservations
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(20, 0, 0, 0);

  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);
  dayAfter.setHours(4, 0, 0, 0);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(18, 0, 0, 0);

  const nextWeekEnd = new Date();
  nextWeekEnd.setDate(nextWeekEnd.getDate() + 8);
  nextWeekEnd.setHours(6, 0, 0, 0);

  const reserva1 = await prisma.reservation.create({
    data: {
      userId: client.id,
      equipmentId: equipos[0].id, // DDJ-1000
      startDate: tomorrow,
      endDate: dayAfter,
      totalPrice: 18000,
      status: "CONFIRMED",
      notes: "Fiesta de cumpleaños en Palermo",
    },
  });

  await prisma.payment.create({
    data: {
      reservationId: reserva1.id,
      amount: 18000,
      status: "COMPLETED",
      method: "TRANSFER",
      reference: "Transfer #12345",
    },
  });

  await prisma.reservation.create({
    data: {
      userId: client.id,
      equipmentId: equipos[4].id, // DJM-900NXS2
      startDate: nextWeek,
      endDate: nextWeekEnd,
      totalPrice: 16000,
      status: "PENDING",
      notes: "Evento corporativo zona norte",
    },
  });

  console.log("Sample reservations created");
  console.log("\nSeed completed!");
  console.log("---");
  console.log("Admin: admin@djrental.com / admin123");
  console.log("Client: cliente@test.com / cliente123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
