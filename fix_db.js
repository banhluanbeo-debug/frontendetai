const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://postgres.umbljhvwrngmltqauobo:Cinema2026Luan@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function fixDB() {
  await client.connect();
  
  try {
    // Check constraints on showtime_seats
    const res = await client.query('SELECT id FROM users LIMIT 1');
    console.log("Valid user ID:", res.rows[0]?.id);
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}

fixDB();
