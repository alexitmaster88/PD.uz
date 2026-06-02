import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const prices = [
  { level: 'A2/B1', price: '250000' },
  { level: 'B1', price: '300000' },
  { level: 'B2', price: '350000' },
  { level: 'C1', price: '400000' },
];

try {
  console.log('Darajalar narxlarini qo\'shmoqda...');
  
  for (const priceData of prices) {
    const query = `
      INSERT INTO exam_levels (level, price, createdAt, updatedAt)
      VALUES (?, ?, NOW(), NOW())
      ON DUPLICATE KEY UPDATE price = ?
    `;
    
    await connection.execute(query, [
      priceData.level,
      priceData.price,
      priceData.price,
    ]);
  }
  
  console.log(`✅ Darajalar narxlari qo'shildi!`);
  console.log('\nQo\'shilgan narxlar:');
  prices.forEach(p => {
    console.log(`- ${p.level}: ${p.price} so\'m`);
  });
  
} catch (error) {
  console.error('Xato:', error.message);
} finally {
  await connection.end();
}
