import { query, getDatabase, initializeTables } from '../lib/database'

async function initDatabase() {
  try {
    console.log('Подключение к базе данных Neon...')
    
    // Инициализация подключения
    await getDatabase()
    
    // Явная инициализация таблиц
    console.log('Инициализация таблиц...')
    await initializeTables()
    console.log('✅ Таблицы инициализированы!')
    
    // Проверка подключения
    const testResult = await query('SELECT NOW() as current_time')
    console.log('✅ Подключение успешно!')
    console.log('Текущее время сервера:', testResult.rows[0].current_time)
    
    // Проверка существующих таблиц
    const tablesResult = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `)
    
    console.log('\nСуществующие таблицы:')
    if (tablesResult.rows.length === 0) {
      console.log('  (таблиц пока нет)')
    } else {
      tablesResult.rows.forEach((row: any) => {
        console.log(`  - ${row.table_name}`)
      })
    }
    
    // Проверка данных
    try {
      const invasionsCount = await query('SELECT COUNT(*) as count FROM invasions')
      const preparationsCount = await query('SELECT COUNT(*) as count FROM preparations')
      const mapDataCount = await query('SELECT COUNT(*) as count FROM map_data')
      
      console.log('\nКоличество записей:')
      console.log(`  - Нашествия: ${invasionsCount.rows[0].count}`)
      console.log(`  - Препараты: ${preparationsCount.rows[0].count}`)
      console.log(`  - Данные карт: ${mapDataCount.rows[0].count}`)
    } catch (err) {
      console.log('\n⚠ Таблицы еще создаются...')
    }
    
    console.log('\n✅ База данных готова к использованию!')
    
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Ошибка подключения к базе данных:', error.message)
    if (error.code) {
      console.error('Код ошибки:', error.code)
    }
    process.exit(1)
  }
}

initDatabase()

