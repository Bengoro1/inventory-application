const { Client } = require('pg');
require('dotenv').config();

const SQL = `
CREATE TABLE IF NOT EXISTS pc_components (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, 
  name TEXT
);
CREATE TABLE IF NOT EXISTS processors (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, 
  manufacturer TEXT, 
  name TEXT, 
  socket TEXT, 
  series TEXT, 
  core_count INT, 
  thread_count INT, 
  core_clock_GHz FLOAT, 
  core_boost_clock_GHz FLOAT, 
  TDP_W INT
);
CREATE TABLE IF NOT EXISTS motherboards (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, 
  manufacturer TEXT, 
  name TEXT, 
  socket TEXT, 
  form_factor TEXT, 
  chipset TEXT, 
  memory_type TEXT, 
  memory_slots INT
);
CREATE TABLE IF NOT EXISTS coolers (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, 
  manufacturer TEXT, 
  model TEXT, 
  min_fan_RPM INT,
  max_fan_RPM INT,
  min_noise_level_dB FLOAT,
  max_noise_level_dB FLOAT,
  height_mm INT,
  socket TEXT[],
  water_cooled TEXT
);
CREATE TABLE IF NOT EXISTS RAMs (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  manufacturer TEXT,
  name TEXT, 
  memory_type TEXT,
  speed_MHz INT, 
  modules TEXT, 
  CAS_latency INT, 
  memory_GB INT
);
CREATE TABLE IF NOT EXISTS storages (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, 
  manufacturer TEXT,
  name TEXT,
  capacity_TB FLOAT,
  type TEXT,
  interface TEXT
);
CREATE TABLE IF NOT EXISTS graphic_cards (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, 
  manufacturer TEXT,
  name TEXT,
  chipset TEXT, 
  memory_GB INT,
  memory_type TEXT,
  core_clock_MHz INT, 
  boost_clock_MHz INT, 
  interface TEXT, 
  length_mm INT, 
  TDP_W INT, 
  number_of_fans INT
);
CREATE TABLE IF NOT EXISTS cases (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, 
  manufacturer TEXT,
  name TEXT,
  type TEXT, 
  side_pannel TEXT, 
  motherboard_form_factor TEXT[], 
  maximum_video_card_length_mm INT, 
  dimensions TEXT
);
CREATE TABLE IF NOT EXISTS power_supplies (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, 
  manufacturer TEXT,
  model TEXT,
  type TEXT,
  efficiency_rating TEXT, 
  wattage_W INT, 
  length_mm INT, 
  modular TEXT
);

INSERT INTO pc_components (name) VALUES ('Processors'), ('Motherboards'), ('Coolers'), ('RAM memory'), ('Storages'), ('Graphic cards'), ('Cases'), ('Power supplies');

INSERT INTO processors (manufacturer, name, socket, series, core_count, thread_count, core_clock_GHz, core_boost_clock_GHz, TDP_W) VALUES
  ('Intel', '12400F', 'LGA1700', 'Intel Core i5', 6, 12, 2.5, 4.4, 65),
  ('AMD', '7700X', 'AM5', 'AMD Ryzen 7', 8, 16, 4.5, 5.4, 105),
  ('AMD', '7600X', 'AM5', 'AMD Ryzen 5', 6, 12, 4.7, 5.3, 105),
  ('AMD', '7800X3D', 'AM5', 'AMD Ryzen 7', 8, 16, 4.2, 5, 120),
  ('AMD', '5600X', 'AM4', 'AMD Ryzen 5', 6, 12, 3.7, 4.6, 65),
  ('Intel', '12700K', 'LGA1700', 'Intel Core i7', 12, 20, 3.6, 5, 125),
  ('AMD', '7950X3D', 'AM5', 'AMD Ryzen 9', 16, 32, 4.2, 5.7, 120),
  ('AMD', '5600X', 'AM4', 'AMD Ryzen 5', 6, 12, 3.7, 4.6, 65),
  ('Intel', '14700K', 'LGA1700', 'Intel Core i7', 20, 28, 3.4, 5.6, 125),
  ('Intel', '14900K', 'LGA1700', 'Intel Core i9', 24, 32, 3.2, 6, 125),
  ('AMD', '5700X3D', 'AM4', 'AMD Ryzen 7', 8, 16, 3, 4.1, 105),
  ('AMD', '9800X3D', 'AM5', 'AMD Ryzen 7', 8, 16, 4.7, 5.2, 120),
  ('AMD', '9950X', 'AM5', 'AMD Ryzen 9', 16, 32, 4.3, 5.7, 170);

INSERT INTO motherboards (manufacturer, name, socket, form_factor, chipset, memory_type, memory_slots) VALUES
  ('MSI', 'B550 GAMING GEN3', 'AM4', 'ATX', 'AMD B550', 'DDR4', 4),
  ('MSI', 'B760 GAMING PLUS WIFI', 'LGA1700', 'ATX', 'Intel B760', 'DDR5', 4),
  ('MSI', 'B650 GAMING PLUS WIFI', 'AM5', 'ATX', 'AMD B650', 'DDR5', 4),
  ('MSI', 'PRO Z790-A MAX WIFI', 'LGA1700', 'ATX', 'Intel Z790', 'DDR5', 4),
  ('MSI', 'B550M PRO-VDH WIFI', 'AM4', 'Micro ATX', 'AMD B550', 'DDR4', 4),
  ('ASRock', 'B660M Pro RS', 'LGA1700', 'Micro ATX', 'Intel B660', 'DDR4', 4),
  ('Asus', 'ROG STRIX B650E-I GAMING WIFI', 'AM5', 'Mini ITX', 'AMD B650E', 'DDR5', 2),
  ('MSI', 'MAG X670E TOMAHAWK WIFI', 'AM5', 'ATX', 'AMD X670E', 'DDR5', 4),
  ('Gigabyte', 'A520M K V2', 'AM4', 'Micro ATX', 'AMD A520', 'DDR4', 2),
  ('Gigabyte', 'X870E AORUS ELITE WIFI7', 'AM5', 'ATX', 'AMD X870E', 'DDR5', 4),
  ('MSI', 'MAG X870 TOMAHAWK WIFI', 'AM5', 'ATX', 'AMD X870', 'DDR5', 4);

INSERT INTO coolers (manufacturer, model, min_fan_RPM, max_fan_RPM, min_noise_level_dB, max_noise_level_dB, height_mm, socket, water_cooled) VALUES
  ('Noctua', 'NH-D15 chromax.black', 300, 1500, 19.2, 24.6, 165, '{"AM2", "AM2+", "AM3", "AM3+", "AM4", "AM5", "FM1", "FM2", "FM2+", "LGA1150", "LGA1151", "LGA1155", "LGA1156", "LGA1200", "LGA1700", "LGA1851", "LGA2011", "LGA2011-3", "LGA2066"}', 'No'),
  ('Deepcool', 'AK400', 500, 1850, 29, 29, 155, '{"AM4", "AM5", "LGA1150", "LGA1151", "LGA1155", "LGA1156", "LGA1200", "LGA1700", "LGA1851"}', 'No'),
  ('Deepcool', 'AK620 ZERO DARK', 500, 1850, 28, 28, 160, '{"AM4", "AM5", "LGA1150", "LGA1151", "LGA1155", "LGA1156", "LGA1200", "LGA1700", "LGA1851", "LGA2011", "LGA2011-3", "LGA2066"}', 'No'),
  ('NZXT', 'Kraken Elite 360 RGB', 500, 1800, 17.9, 30.6, 60, '{"AM4", "AM5", "sTR4", "sTRX4", "LGA1150", "LGA1151", "LGA1155", "LGA1156", "LGA1200", "LGA1700", "LGA1851"}', '360 mm'),
  ('Cooler Master', 'Hyper 212 Black Edition', 650, 2000, 6.5, 26, 159, '{"AM2", "AM2+", "AM3", "AM3+", "AM4", "AM5", "FM1", "FM2", "FM2+", "LGA1150", "LGA1151", "LGA1155", "LGA1156", "LGA1200", "LGA1366", "LGA1700", "LGA1851", "LGA2011", "LGA2011-3", "LGA2066"}', 'No'),
  ('Thermalright', 'Peerless Assassin 120 SE', 1550, 1550, 25.6, 25.6, 155, '{"AM4", "AM5", "LGA1150", "LGA1151", "LGA1155", "LGA1156", "LGA1200", "LGA1700", "LGA1851"}', 'No'),
  ('Corsair', 'iCUE H150i ELITE CAPELLIX XT', 550, 2100, 5, 34.1, 397, '{"AM4", "AM5", "sTR4", "sTRX4", "LGA1150", "LGA1151", "LGA1155", "LGA1156", "LGA1200", "LGA1700", "LGA1851", "LGA2011", "LGA2011-3", "LGA2066"}', '360 mm'),
  ('ARCTIC', 'Liquid Freezer III 360', 200, 1800, null, null, 398, '{"AM4", "AM5", "LGA1700", "LGA1851"}', 'No');

INSERT INTO RAMs (manufacturer, name, memory_type, speed_MHz, modules, CAS_latency, memory_GB) VALUES
  ('Corsair', 'Vengeance LPX', 'DDR4', 3200, '2 x 8GB', 16, 16),
  ('G.Skill', 'Trident Z5 RGB', 'DDR5', 6400, '2 x 32GB', 32, 64),
  ('G.Skill', 'Flare X5', 'DDR5', 6000, '2 x 16 GB', 30, 32),
  ('Corsair', 'Vengeance', 'DDR5', 6000, '2 x 16GB', 30, 32),
  ('G.Skill', 'Ripjaws V', 'DDR4', 3200, '2 x 16 GB', 16, 32),
  ('TEAMGROUP', 'T-Create Expert', 'DDR5', 6000, '2 x 16GB', 30, 32),
  ('Corsair', 'Vengeance RGB', 'DDR5', 6000, '2 x 32GB', 30, 64);

INSERT INTO storages (manufacturer, name, capacity_TB, type, interface) VALUES
  ('Western Digital', 'Black SN770', 1, 'SSD', 'M.2 PCIe 4.0 X4'),
  ('Kingston', 'NV2', 0.5, 'SSD', 'M.2 PCIe 4.0 X4'),
  ('Western Digital', 'Blue SN580', 1, 'SSD', 'M.2 PCIe 4.0 X4'),
  ('Crucial', 'P3 Plus', 2, 'SSD', 'M.2 PCIe 4.0 X4'),
  ('Kingston', 'NV2', 1, 'SSD', 'M.2 PCIe 4.0 X4'),
  ('Samsung', '990 Pro', 2, 'SSD', 'M.2 PCIe 4.0 X4'),
  ('Samsung', '990 Pro', 4, 'SSD', 'M.2 PCIe 4.0 X4');

INSERT INTO  graphic_cards (manufacturer, name, chipset, memory_GB, memory_type, core_clock_MHz, boost_clock_MHz, interface, length_mm, TDP_W, number_of_fans) VALUES
  ('Gigabyte', 'GAMING OC', 'GeForce RTX 4090', 24, 'GDDR6X', 2235, 2535, 'PCIe x16', 340, 450, 3),
  ('XFX', 'Speedster MERC 310 Black Edition', 'Radeon RX 7900 XTX', 24, 'GDDR6', 2300, 2615, 'PCIe x16', 344, 355, 3),
  ('MSI', 'VENTUS 3X OC', 'GeForce RTX 4070 SUPER', 12, 'GDDR6X', 1980, 2520, 'PCIe x16', 308, 220, 3),
  ('MSI', 'VENTUS 3X OC', 'GeForce RTX 4080 SUPER', 16, 'GDDR6X', 2210, 2595, 'PCIe x16', 322, 320, 3),
  ('XFX', 'Speedster QICK 319 BLACK', 'Radeon RX 7700 XT', 12, 'GDDR6', 1700, 2599, 'PCIe x16', 335, 245, 3),
  ('XFX', 'Speedster QICK 319 Core', 'Radeon RX 7800 XT', 16, 'GDDR6', 1295, 2430, 'PCIe x16', 335, 263, 3),
  ('XFX', 'Speedster QICK 319', 'Radeon RX 7600 XT', 16, 'GDDR6', 1720, 2810, 'PCIe x16', 302, 190, 3),
  ('XFX', null, 'Radeon RX 7900 GRE', 16, 'GDDR6', 1270, 2395, 'PCIe x16', 335, 260, 3);

INSERT INTO cases (manufacturer, name, type, side_pannel, motherboard_form_factor, maximum_video_card_length_mm, dimensions) VALUES
  ('Corsair', '4000D Airflow', 'ATX Mid Tower', 'Tinted Tempered Glass', '{"ATX", "EATX", "Micro ATX", "Mini ITX"}', 360, '453 mm x 230 mm x 466 mm'),
  ('NZXT', 'H5 Flow (2022)', 'ATX Mid Tower', 'Tempered Glass', '{"ATX", "EATX", "Micro ATX", "Mini ITX"}', 365, '446 mm x 227 mm x 464 mm'),
  ('NZXT', 'H9 Flow', 'ATX Mid Tower', 'Tempered Glass', '{"ATX", "Micro ATX", "Mini ITX"}', 435, '466 mm x 290 mm x 495 mm'),
  ('Montech', 'XR', 'ATX Mid Tower', 'Tempered Glass', '{"ATX", "Micro ATX", "Mini ITX"}', 420, '435 mm x 230 mm x 450 mm'),
  ('Montech', 'AIR 903 MAX', 'ATX Mid Tower', 'Tempered Glass', '{"ATX", "EATX", "Micro ATX", "Mini ITX"}', 400, '478 mm x 230 mm x 493 mm'),
  ('Lian Li', 'O11 Vision', 'ATX Mid Tower', 'Tempered Glass', '{"ATX", "EATX", "Micro ATX", "Mini ITX"}', 455, '480 mm x 304 mm x 464.5 mm'),
  ('Deepcool', 'CC560 V2', 'ATX Mid Tower', 'Tempered Glass', '{"ATX", "Micro ATX", "Mini ITX"}', 370, '432 mm x 215 mm x 483 mm');

INSERT INTO power_supplies (manufacturer, model, type, efficiency_rating, wattage_W, length_mm, modular) VALUES
  ('Corsair', 'RM750e (2023)', 'ATX', '80+ Gold', 750, 140, 'Full'),
  ('Corsair', 'RM850e (2023)', 'ATX', '80+ Gold', 850, 140, 'Full'),
  ('Corsair', 'RM1000e (2023)', 'ATX', '80+ Gold', 1000, 140, 'Full'),
  ('Corsair', 'RM650 (2023)', 'ATX', '80+ Gold', 650, 140, 'Full'),
  ('MSI', 'MAG A850GL', 'ATX', '80+ Gold', 850, 140, 'Full'),
  ('MSI', 'MAG A750GL', 'ATX', '80+ Gold', 750, 140, 'Full'),
  ('MSI', 'MAG A650GL', 'ATX', '80+ Gold', 650, 140, 'Full');
`;

const INSERT_SQL = `
ALTER TABLE pc_components
ADD url TEXT;

UPDATE pc_components SET url = (CASE
  WHEN name = 'Processors' THEN 'processors'
  WHEN name = 'Motherboards' THEN 'motherboards'
  WHEN name = 'Coolers' THEN 'coolers'
  WHEN name = 'RAM memory' THEN 'RAMs'
  WHEN name = 'Storages' THEN 'storages'
  WHEN name = 'Graphic cards' THEN 'graphic_cards'
  WHEN name = 'Cases' THEN 'cases'
  WHEN name = 'Power supplies' THEN 'power_supplies'
END);
`;

async function main() {
  console.log('Starting');
  const client = new Client({ connectionString: process.env.DB_URL });
  await client.connect();
  await client.query(INSERT_SQL);
  await client.end();
  console.log('Ending');
}

main();