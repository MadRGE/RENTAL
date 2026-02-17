-- =============================================
-- Rental Des⚡Controladoras - Setup SQL
-- Pegá esto en el SQL Editor de Supabase
-- =============================================

-- 1. CREAR TABLAS
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'CLIENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

CREATE TABLE IF NOT EXISTS "Equipment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "image" TEXT,
    "pricePerHour" DOUBLE PRECISION NOT NULL,
    "pricePerDay" DOUBLE PRECISION NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Reservation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Payment" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "method" TEXT,
    "reference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Payment_reservationId_key" ON "Payment"("reservationId");

-- Foreign Keys
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- 2. SEED DATA - Usuarios
INSERT INTO "User" ("id", "name", "email", "password", "phone", "role", "createdAt", "updatedAt") VALUES
('admin001', 'Admin Des⚡Controladoras', 'admin@djrental.com', '$2b$10$B29deK95PafDHZgrdBoom./F4l6PZYPX02HNmoiZgyo8QB0AzVed.', '+54 11 3192-9239', 'ADMIN', NOW(), NOW()),
('client001', 'Juan Pérez', 'cliente@test.com', '$2b$10$8M7F3FXGQu36EPatyPW/Y.E/Ptabh1kVhVjF8EMQlVO196iLFMwOa', '+54 11 1234-5678', 'CLIENT', NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

-- 3. SEED DATA - Equipos
INSERT INTO "Equipment" ("id", "name", "brand", "description", "category", "pricePerHour", "pricePerDay", "available", "featured", "createdAt", "updatedAt") VALUES
('eq001', 'DDJ-1000', 'Pioneer DJ', 'Controladora DJ profesional de 4 canales. La DDJ-1000 es la controladora más popular para DJs profesionales, con jog wheels de tamaño completo, pads de performance y efectos integrados. Compatible con Rekordbox.', 'CONTROLLER', 3500, 18000, true, true, NOW(), NOW()),
('eq002', 'DDJ-FLX6', 'Pioneer DJ', 'Controladora de 4 canales compatible con Rekordbox y Serato DJ Pro. Diseño compacto con Merge FX para transiciones creativas. Perfecta para DJs intermedios.', 'CONTROLLER', 2000, 10000, true, true, NOW(), NOW()),
('eq003', 'CDJ-3000', 'Pioneer DJ', 'Reproductor DJ multi-formato de nivel profesional. Pantalla táctil de 9 pulgadas, MPU de alto rendimiento y conectividad avanzada. El estándar de la industria en cabinas de DJ.', 'CONSOLE', 5000, 28000, true, true, NOW(), NOW()),
('eq004', 'CDJ-2000NXS2', 'Pioneer DJ', 'El reproductor multi-formato profesional más utilizado en clubs y eventos. Display a color, Pro DJ Link y soporte de audio Hi-Res.', 'CONSOLE', 4000, 22000, true, true, NOW(), NOW()),
('eq005', 'DJM-900NXS2', 'Pioneer DJ', 'Mixer DJ profesional de 4 canales con efectos avanzados, interfaz de audio de 64 bits y aisladores independientes por canal. El mixer más usado en clubs del mundo.', 'MIXER', 3000, 16000, true, true, NOW(), NOW()),
('eq006', 'DDJ-400', 'Pioneer DJ', 'Controladora de 2 canales perfecta para principiantes. Compacta, portátil y con todas las funciones esenciales para aprender a mezclar. Compatible con Rekordbox.', 'CONTROLLER', 1200, 6000, true, false, NOW(), NOW()),
('eq007', 'Traktor Kontrol S4 MK3', 'Native Instruments', 'Controladora DJ de 4 canales con jog wheels motorizados y pantallas a color integradas. Diseñada para Traktor Pro con control haptic drive.', 'CONTROLLER', 2500, 13000, true, false, NOW(), NOW()),
('eq008', 'SC6000 Prime', 'Denon DJ', 'Reproductor DJ profesional con pantalla táctil HD de 10.1 pulgadas, streaming de música integrado y motor de análisis avanzado. Almacenamiento SSD interno.', 'CONSOLE', 4500, 25000, true, true, NOW(), NOW()),
('eq009', 'EV ELX200-15P', 'Electro-Voice', 'Parlante activo de 15 pulgadas, 1200W de potencia. Ideal para eventos medianos a grandes. DSP integrado con presets de aplicación. Se alquila en pares.', 'SPEAKER', 2000, 10000, true, false, NOW(), NOW()),
('eq010', 'QSC KW181', 'QSC', 'Subwoofer activo de 18 pulgadas, 1000W. Respuesta de graves potente y profunda para complementar tu sistema de sonido. Ideal para fiestas y eventos.', 'SPEAKER', 2500, 12000, true, false, NOW(), NOW()),
('eq011', 'Moving Head Beam 230W', 'Beamz', 'Cabeza móvil beam de 230W con prisma rotativo, gobos y efectos de color. Perfecta para crear ambiente en fiestas y eventos. Se alquila por unidad.', 'LIGHTING', 1500, 8000, true, false, NOW(), NOW()),
('eq012', 'Máquina de Humo 1500W', 'Antari', 'Máquina de humo profesional con control DMX y mando inalámbrico. Incluye líquido para 4 horas de uso continuo. Ideal para complementar iluminación.', 'OTHER', 800, 4000, true, false, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

-- 4. SEED DATA - Reservas de ejemplo
INSERT INTO "Reservation" ("id", "userId", "equipmentId", "startDate", "endDate", "totalPrice", "status", "notes", "createdAt", "updatedAt") VALUES
('res001', 'client001', 'eq001', NOW() + INTERVAL '1 day', NOW() + INTERVAL '2 days', 18000, 'CONFIRMED', 'Fiesta de cumpleaños en Palermo', NOW(), NOW()),
('res002', 'client001', 'eq005', NOW() + INTERVAL '7 days', NOW() + INTERVAL '8 days', 16000, 'PENDING', 'Evento corporativo zona norte', NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Payment" ("id", "reservationId", "amount", "status", "method", "reference", "createdAt", "updatedAt") VALUES
('pay001', 'res001', 18000, 'COMPLETED', 'TRANSFER', 'Transfer #12345', NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

-- Done!
-- Admin: admin@djrental.com / admin123
-- Cliente: cliente@test.com / cliente123
