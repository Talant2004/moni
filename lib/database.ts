import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

// Database file path
const dbPath = path.join(process.cwd(), 'data', 'sarancha.db')
const dbDir = path.dirname(dbPath)

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

// Initialize database
let db: Database.Database | null = null

export function getDatabase(): Database.Database {
  if (!db) {
    db = new Database(dbPath)
    initializeTables()
  }
  return db
}

function initializeTables() {
  if (!db) return

  // Check if map_data table exists and has weather columns
  const tableInfo = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='map_data'").get()
  if (tableInfo) {
    // Check if weather columns exist
    const columns = db.prepare("PRAGMA table_info(map_data)").all() as Array<{ name: string }>
    const columnNames = columns.map(col => col.name)
    
    // Add missing weather columns if they don't exist
    if (!columnNames.includes('temperature')) {
      db.exec('ALTER TABLE map_data ADD COLUMN temperature REAL')
    }
    if (!columnNames.includes('precipitation')) {
      db.exec('ALTER TABLE map_data ADD COLUMN precipitation REAL')
    }
    if (!columnNames.includes('humidity')) {
      db.exec('ALTER TABLE map_data ADD COLUMN humidity REAL')
    }
    if (!columnNames.includes('wind_speed')) {
      db.exec('ALTER TABLE map_data ADD COLUMN wind_speed REAL')
    }
  }

  // Invasions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS invasions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      full_text TEXT,
      region TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Preparations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS preparations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      active_substance TEXT,
      application_method TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Map data table
  db.exec(`
    CREATE TABLE IF NOT EXISTS map_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      region TEXT,
      district TEXT,
      year INTEGER,
      season TEXT,
      latitude REAL,
      longitude REAL,
      threat_level INTEGER,
      treated_area REAL,
      population_density REAL,
      temperature REAL,
      precipitation REAL,
      humidity REAL,
      wind_speed REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Invasion photos table
  db.exec(`
    CREATE TABLE IF NOT EXISTS invasion_photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invasion_id INTEGER,
      photo_path TEXT,
      FOREIGN KEY (invasion_id) REFERENCES invasions(id)
    )
  `)

  // Invasion links table
  db.exec(`
    CREATE TABLE IF NOT EXISTS invasion_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invasion_id INTEGER,
      title TEXT,
      url TEXT,
      FOREIGN KEY (invasion_id) REFERENCES invasions(id)
    )
  `)

  // Insert sample data if tables are empty
  const invasionCount = db.prepare('SELECT COUNT(*) as count FROM invasions').get() as { count: number }
  if (invasionCount.count === 0) {
    const insertInvasion = db.prepare(`
      INSERT INTO invasions (year, title, description, full_text, region)
      VALUES (?, ?, ?, ?, ?)
    `)
    
    const result = insertInvasion.run(
      2020,
      'Нашествие мароккской саранчи 2020',
      'Крупное нашествие мароккской саранчи в южных регионах Казахстана',
      'В 2020 году произошло одно из крупнейших нашествий мароккской саранчи в истории Казахстана. Вспышка численности началась весной и охватила обширные территории южных областей. Данное событие было связано с благоприятными погодными условиями в предыдущие годы, что способствовало увеличению популяции. Меры по борьбе с вредителем были предприняты своевременно, что позволило минимизировать ущерб сельскому хозяйству.',
      'Южный Казахстан'
    )
    
    const invasionId = result.lastInsertRowid
    
    // Insert sample links
    const insertLink = db.prepare(`
      INSERT INTO invasion_links (invasion_id, title, url)
      VALUES (?, ?, ?)
    `)
    insertLink.run(invasionId, 'Отчет КазНИИЗиКР', '#')
    insertLink.run(invasionId, 'Публикация авторов', '#')
  }

  const prepCount = db.prepare('SELECT COUNT(*) as count FROM preparations').get() as { count: number }
  if (prepCount.count === 0) {
    const insertPrep = db.prepare(`
      INSERT INTO preparations (name, description, active_substance, application_method)
      VALUES (?, ?, ?, ?)
    `)
    
    insertPrep.run('Диазинон', 'Инсектицид контактно-кишечного действия', 'Диазинон', 'Опрыскивание')
    insertPrep.run('Децис', 'Высокоэффективный инсектицид', 'Делтаметрин', 'Опрыскивание')
  }

  // Update existing records without weather data
  const updateWeather = db.prepare(`
    UPDATE map_data 
    SET temperature = ?, precipitation = ?, humidity = ?, wind_speed = ?
    WHERE id = ? AND (temperature IS NULL OR precipitation IS NULL OR humidity IS NULL OR wind_speed IS NULL)
  `)
  
  // Weather data for existing records (matching the sample data order)
  const weatherUpdates: Array<[number, number, number, number, number]> = [
    [18.5, 45.2, 65, 12.3, 1],
    [19.2, 38.5, 62, 10.8, 2],
    [15.8, 52.3, 70, 15.2, 3],
    [22.5, 28.7, 58, 8.5, 4],
    [16.2, 35.4, 68, 11.2, 5],
    [20.8, 42.1, 60, 9.8, 6],
    [12.5, 55.8, 75, 14.5, 7],
    [8.3, 48.2, 78, 16.8, 8],
    [14.2, 42.5, 72, 13.2, 9],
    [10.8, 58.3, 80, 18.5, 10],
  ]
  
  // Update existing records
  const existingRecords = db.prepare('SELECT id FROM map_data WHERE temperature IS NULL OR precipitation IS NULL OR humidity IS NULL OR wind_speed IS NULL LIMIT 10').all() as Array<{ id: number }>
  existingRecords.forEach((record, index) => {
    if (index < weatherUpdates.length) {
      const [temp, precip, hum, wind] = weatherUpdates[index]
      updateWeather.run(temp, precip, hum, wind, record.id)
    }
  })

  // Insert sample map data if table is empty
  const mapDataCount = db.prepare('SELECT COUNT(*) as count FROM map_data').get() as { count: number }
  if (mapDataCount.count === 0) {
    const insertMapData = db.prepare(`
      INSERT INTO map_data (region, district, year, season, latitude, longitude, threat_level, treated_area, population_density, temperature, precipitation, humidity, wind_speed)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    // Sample data for different regions with weather data
    // Format: [region, district, year, season, lat, lon, threat, treated, density, temp, precip, humidity, wind]
    const sampleData = [
      ['Алматы', 'Енбекшиказахский', 2023, 'spring', 43.25, 76.95, 3, 1500, 2.5, 18.5, 45.2, 65, 12.3],
      ['Алматы', 'Карасайский', 2023, 'spring', 43.30, 76.90, 2, 800, 1.8, 19.2, 38.5, 62, 10.8],
      ['Жамбыл', 'Жамбылский', 2022, 'autumn', 42.90, 71.40, 4, 2500, 3.2, 15.8, 52.3, 70, 15.2],
      ['Туркестан', 'Туркестанский', 2022, 'spring', 43.20, 68.20, 3, 1200, 2.8, 22.5, 28.7, 58, 8.5],
      ['Кызылорда', 'Сырдарьинский', 2021, 'autumn', 44.85, 65.60, 2, 600, 1.5, 16.2, 35.4, 68, 11.2],
      ['Южно-Казахстанская', 'Сарыагашский', 2023, 'spring', 42.35, 69.75, 3, 1800, 2.9, 20.8, 42.1, 60, 9.8],
      ['Акмола', 'Целиноградский', 2021, 'spring', 51.15, 71.45, 1, 300, 0.8, 12.5, 55.8, 75, 14.5],
      ['Костанай', 'Костанайский', 2022, 'autumn', 53.30, 63.70, 2, 900, 1.2, 8.3, 48.2, 78, 16.8],
      ['Караганда', 'Карагандинский', 2023, 'spring', 49.95, 73.20, 1, 400, 0.9, 14.2, 42.5, 72, 13.2],
      ['Павлодар', 'Павлодарский', 2022, 'spring', 52.30, 77.00, 1, 250, 0.6, 10.8, 58.3, 80, 18.5],
    ]
    
    for (const data of sampleData) {
      insertMapData.run(...data)
    }
  }
}

export function closeDatabase() {
  if (db) {
    db.close()
    db = null
  }
}

