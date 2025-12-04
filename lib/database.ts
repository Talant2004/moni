import { Pool, QueryResult } from 'pg'

// Database connection pool for Neon PostgreSQL
let pool: Pool | null = null

function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL || 
      'postgresql://neondb_owner:npg_Yt78lpVHuvRL@ep-shiny-river-a4bqz4jy-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000, // Увеличено до 10 секунд
    })

    // Initialize tables on first connection (async, but don't wait)
    initializeTables().catch(err => console.error('Error initializing tables:', err))
  }
  return pool
}

async function query(text: string, params?: any[]): Promise<QueryResult> {
  const client = getPool()
  return client.query(text, params)
}

async function initializeTables() {
  try {
    // Check if map_data table exists and has weather columns
    const tableCheck = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'map_data'
      )
    `)
    
    if (tableCheck.rows[0].exists) {
      // Check if weather columns exist
      const columnsCheck = await query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'map_data' 
        AND column_name IN ('temperature', 'precipitation', 'humidity', 'wind_speed')
      `)
      
      const columnNames = columnsCheck.rows.map((row: any) => row.column_name)
      
      // Add missing weather columns if they don't exist
      if (!columnNames.includes('temperature')) {
        await query('ALTER TABLE map_data ADD COLUMN temperature DOUBLE PRECISION')
      }
      if (!columnNames.includes('precipitation')) {
        await query('ALTER TABLE map_data ADD COLUMN precipitation DOUBLE PRECISION')
      }
      if (!columnNames.includes('humidity')) {
        await query('ALTER TABLE map_data ADD COLUMN humidity DOUBLE PRECISION')
      }
      if (!columnNames.includes('wind_speed')) {
        await query('ALTER TABLE map_data ADD COLUMN wind_speed DOUBLE PRECISION')
      }
    }

    // Invasions table
    await query(`
      CREATE TABLE IF NOT EXISTS invasions (
        id SERIAL PRIMARY KEY,
        year INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        full_text TEXT,
        region TEXT,
        title_kk TEXT,
        description_kk TEXT,
        full_text_kk TEXT,
        region_kk TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Add Kazakh columns if they don't exist
    try {
      const invasionColumnsCheck = await query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'invasions' 
        AND column_name IN ('title_kk', 'description_kk', 'full_text_kk', 'region_kk')
      `)
      const invasionColumnNames = invasionColumnsCheck.rows.map((row: any) => row.column_name)
      
      if (!invasionColumnNames.includes('title_kk')) {
        await query('ALTER TABLE invasions ADD COLUMN title_kk TEXT')
      }
      if (!invasionColumnNames.includes('description_kk')) {
        await query('ALTER TABLE invasions ADD COLUMN description_kk TEXT')
      }
      if (!invasionColumnNames.includes('full_text_kk')) {
        await query('ALTER TABLE invasions ADD COLUMN full_text_kk TEXT')
      }
      if (!invasionColumnNames.includes('region_kk')) {
        await query('ALTER TABLE invasions ADD COLUMN region_kk TEXT')
      }
    } catch (e) {
      // Columns might already exist, ignore
    }

    // Preparations table
    await query(`
      CREATE TABLE IF NOT EXISTS preparations (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        active_substance TEXT,
        application_method TEXT,
        name_kk TEXT,
        description_kk TEXT,
        active_substance_kk TEXT,
        application_method_kk TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `).catch(() => {}) // Игнорируем ошибки если таблица уже существует

    // Add Kazakh columns if they don't exist
    try {
      const prepColumnsCheck = await query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'preparations' 
        AND column_name IN ('name_kk', 'description_kk', 'active_substance_kk', 'application_method_kk')
      `)
      const prepColumnNames = prepColumnsCheck.rows.map((row: any) => row.column_name)
      
      if (!prepColumnNames.includes('name_kk')) {
        await query('ALTER TABLE preparations ADD COLUMN name_kk TEXT')
      }
      if (!prepColumnNames.includes('description_kk')) {
        await query('ALTER TABLE preparations ADD COLUMN description_kk TEXT')
      }
      if (!prepColumnNames.includes('active_substance_kk')) {
        await query('ALTER TABLE preparations ADD COLUMN active_substance_kk TEXT')
      }
      if (!prepColumnNames.includes('application_method_kk')) {
        await query('ALTER TABLE preparations ADD COLUMN application_method_kk TEXT')
      }
    } catch (e) {
      // Columns might already exist, ignore
    }

    // Map data table
    await query(`
      CREATE TABLE IF NOT EXISTS map_data (
        id SERIAL PRIMARY KEY,
        region TEXT,
        district TEXT,
        year INTEGER,
        season TEXT,
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION,
        threat_level INTEGER,
        treated_area DOUBLE PRECISION,
        population_density DOUBLE PRECISION,
        temperature DOUBLE PRECISION,
        precipitation DOUBLE PRECISION,
        humidity DOUBLE PRECISION,
        wind_speed DOUBLE PRECISION,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Invasion photos table
    await query(`
      CREATE TABLE IF NOT EXISTS invasion_photos (
        id SERIAL PRIMARY KEY,
        invasion_id INTEGER REFERENCES invasions(id),
        photo_path TEXT
      )
    `)

    // Invasion links table
    await query(`
      CREATE TABLE IF NOT EXISTS invasion_links (
        id SERIAL PRIMARY KEY,
        invasion_id INTEGER REFERENCES invasions(id),
        title TEXT,
        url TEXT
      )
    `)

    // Insert sample data if tables are empty
    const invasionCount = await query('SELECT COUNT(*) as count FROM invasions')
    if (parseInt(invasionCount.rows[0].count) === 0) {
      const insertInvasion = await query(`
        INSERT INTO invasions (year, title, description, full_text, region, title_kk, description_kk, full_text_kk, region_kk)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
      `, [
        2020,
        'Нашествие мароккской саранчи 2020',
        'Крупное нашествие мароккской саранчи в южных регионах Казахстана',
        'В 2020 году произошло одно из крупнейших нашествий мароккской саранчи в истории Казахстана. Вспышка численности началась весной и охватила обширные территории южных областей. Данное событие было связано с благоприятными погодными условиями в предыдущие годы, что способствовало увеличению популяции. Меры по борьбе с вредителем были предприняты своевременно, что позволило минимизировать ущерб сельскому хозяйству.',
        'Южный Казахстан',
        'Марокко шегірткесінің шабуылы 2020',
        'Қазақстанның оңтүстік аймақтарында марокко шегірткесінің үлкен шабуылы',
        '2020 жылы Қазақстан тарихында марокко шегірткесінің ең үлкен шабуылдарының бірі болды. Сандық жарылыс көктемде басталып, оңтүстік облыстардың кең аумақтарын қамтыды. Бұл оқиға алдыңғы жылдардағы қолайлы ауа райы жағдайларымен байланысты болды, бұл популяцияның өсуіне ықпал етті. Зиянкеспен күресу шаралары уақытында қабылданды, бұл ауыл шаруашылығына зиянды минимизациялауға мүмкіндік берді.',
        'Оңтүстік Қазақстан'
      ])
      
      const invasionId = insertInvasion.rows[0].id
      
      // Insert sample links
      await query(`
        INSERT INTO invasion_links (invasion_id, title, url)
        VALUES ($1, $2, $3)
      `, [invasionId, 'Отчет КазНИИЗиКР', '#'])
      
      await query(`
        INSERT INTO invasion_links (invasion_id, title, url)
        VALUES ($1, $2, $3)
      `, [invasionId, 'Публикация авторов', '#'])
    } else {
      // Update existing records with Kazakh translations if they don't have them
      const existingInvasions = await query(`
        SELECT id FROM invasions 
        WHERE title_kk IS NULL OR description_kk IS NULL
        LIMIT 1
      `)
      
      if (existingInvasions.rows.length > 0) {
        await query(`
          UPDATE invasions 
          SET title_kk = 'Марокко шегірткесінің шабуылы 2020',
              description_kk = 'Қазақстанның оңтүстік аймақтарында марокко шегірткесінің үлкен шабуылы',
              full_text_kk = '2020 жылы Қазақстан тарихында марокко шегірткесінің ең үлкен шабуылдарының бірі болды. Сандық жарылыс көктемде басталып, оңтүстік облыстардың кең аумақтарын қамтыды. Бұл оқиға алдыңғы жылдардағы қолайлы ауа райы жағдайларымен байланысты болды, бұл популяцияның өсуіне ықпал етті. Зиянкеспен күресу шаралары уақытында қабылданды, бұл ауыл шаруашылығына зиянды минимизациялауға мүмкіндік берді.',
              region_kk = 'Оңтүстік Қазақстан'
          WHERE id = $1
        `, [existingInvasions.rows[0].id])
      }
    }

    const prepCount = await query('SELECT COUNT(*) as count FROM preparations')
    if (parseInt(prepCount.rows[0].count) === 0) {
      await query(`
        INSERT INTO preparations (name, description, active_substance, application_method, name_kk, description_kk, active_substance_kk, application_method_kk)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, ['Диазинон', 'Инсектицид контактно-кишечного действия', 'Диазинон', 'Опрыскивание', 'Диазинон', 'Контактты-ішек әсері бар инсектицид', 'Диазинон', 'Бүрку'])
      
      await query(`
        INSERT INTO preparations (name, description, active_substance, application_method, name_kk, description_kk, active_substance_kk, application_method_kk)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, ['Децис', 'Высокоэффективный инсектицид', 'Делтаметрин', 'Опрыскивание', 'Децис', 'Жоғары тиімді инсектицид', 'Делтаметрин', 'Бүрку'])
    } else {
      // Update existing records with Kazakh translations if they don't have them
      const existingPreps = await query(`
        SELECT id FROM preparations 
        WHERE name_kk IS NULL OR description_kk IS NULL
        LIMIT 2
      `)
      
      if (existingPreps.rows.length > 0) {
        for (let i = 0; i < existingPreps.rows.length; i++) {
          const prepId = existingPreps.rows[i].id
          if (i === 0) {
            await query(`
              UPDATE preparations 
              SET name_kk = 'Диазинон',
                  description_kk = 'Контактты-ішек әсері бар инсектицид',
                  active_substance_kk = 'Диазинон',
                  application_method_kk = 'Бүрку'
              WHERE id = $1
            `, [prepId])
          } else if (i === 1) {
            await query(`
              UPDATE preparations 
              SET name_kk = 'Децис',
                  description_kk = 'Жоғары тиімді инсектицид',
                  active_substance_kk = 'Делтаметрин',
                  application_method_kk = 'Бүрку'
              WHERE id = $1
            `, [prepId])
          }
        }
      }
    }

    // Update existing records without weather data
    const existingRecords = await query(`
      SELECT id FROM map_data 
      WHERE temperature IS NULL OR precipitation IS NULL OR humidity IS NULL OR wind_speed IS NULL 
      LIMIT 10
    `)
    
    // Weather data for existing records
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
    
    for (let i = 0; i < existingRecords.rows.length && i < weatherUpdates.length; i++) {
      const record = existingRecords.rows[i]
      const [temp, precip, hum, wind, id] = weatherUpdates[i]
      await query(`
        UPDATE map_data 
        SET temperature = $1, precipitation = $2, humidity = $3, wind_speed = $4
        WHERE id = $5
      `, [temp, precip, hum, wind, record.id])
    }

    // Insert sample map data if table is empty
    const mapDataCount = await query('SELECT COUNT(*) as count FROM map_data')
    if (parseInt(mapDataCount.rows[0].count) === 0) {
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
        await query(`
          INSERT INTO map_data (region, district, year, season, latitude, longitude, threat_level, treated_area, population_density, temperature, precipitation, humidity, wind_speed)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        `, data)
      }
    }
  } catch (error) {
    console.error('Error initializing database:', error)
  }
}

export async function getDatabase() {
  return getPool()
}

export async function closeDatabase() {
  if (pool) {
    await pool.end()
    pool = null
  }
}

// Export query function for use in API routes
export { query, initializeTables }
