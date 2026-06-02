import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Sample exam data for all regions and levels
const sampleExams = [
  // Tashkent - A2/B1
  { levelId: 1, region: 'tashkent', address: 'Tashkent - Olmazor ko\'chasi, 313-uy', examDate: '2026-06-15', startTime: '09:00', endTime: '11:00', capacity: 30 },
  { levelId: 1, region: 'tashkent', address: 'Tashkent - Olmazor ko\'chasi, 313-uy', examDate: '2026-07-15', startTime: '09:00', endTime: '11:00', capacity: 30 },
  
  // Tashkent - B1
  { levelId: 2, region: 'tashkent', address: 'Tashkent - Olmazor ko\'chasi, 313-uy', examDate: '2026-06-20', startTime: '14:00', endTime: '16:00', capacity: 25 },
  { levelId: 2, region: 'tashkent', address: 'Tashkent - Olmazor ko\'chasi, 313-uy', examDate: '2026-07-20', startTime: '14:00', endTime: '16:00', capacity: 25 },
  
  // Tashkent - B2
  { levelId: 3, region: 'tashkent', address: 'Tashkent - Olmazor ko\'chasi, 313-uy', examDate: '2026-06-25', startTime: '10:00', endTime: '12:30', capacity: 20 },
  { levelId: 3, region: 'tashkent', address: 'Tashkent - Olmazor ko\'chasi, 313-uy', examDate: '2026-07-25', startTime: '10:00', endTime: '12:30', capacity: 20 },
  
  // Tashkent - C1
  { levelId: 4, region: 'tashkent', address: 'Tashkent - Olmazor ko\'chasi, 313-uy', examDate: '2026-06-30', startTime: '15:00', endTime: '17:30', capacity: 15 },
  { levelId: 4, region: 'tashkent', address: 'Tashkent - Olmazor ko\'chasi, 313-uy', examDate: '2026-07-30', startTime: '15:00', endTime: '17:30', capacity: 15 },
  
  // Samarkand - A2/B1
  { levelId: 1, region: 'samarkand', address: 'Samarkand - Yoshlar kreativ shaharchasi', examDate: '2026-06-16', startTime: '09:00', endTime: '11:00', capacity: 25 },
  { levelId: 1, region: 'samarkand', address: 'Samarkand - Yoshlar kreativ shaharchasi', examDate: '2026-07-16', startTime: '09:00', endTime: '11:00', capacity: 25 },
  
  // Samarkand - B1
  { levelId: 2, region: 'samarkand', address: 'Samarkand - Yoshlar kreativ shaharchasi', examDate: '2026-06-21', startTime: '14:00', endTime: '16:00', capacity: 20 },
  { levelId: 2, region: 'samarkand', address: 'Samarkand - Yoshlar kreativ shaharchasi', examDate: '2026-07-21', startTime: '14:00', endTime: '16:00', capacity: 20 },
  
  // Fergana - A2/B1
  { levelId: 1, region: 'fergana', address: 'Fergana - Markaziy Test Markazi', examDate: '2026-06-17', startTime: '09:00', endTime: '11:00', capacity: 20 },
  { levelId: 1, region: 'fergana', address: 'Fergana - Markaziy Test Markazi', examDate: '2026-07-17', startTime: '09:00', endTime: '11:00', capacity: 20 },
  
  // Bukhara - B1
  { levelId: 2, region: 'bukhara', address: 'Bukhara - Davlat Universiteti', examDate: '2026-06-22', startTime: '10:00', endTime: '12:00', capacity: 18 },
  { levelId: 2, region: 'bukhara', address: 'Bukhara - Davlat Universiteti', examDate: '2026-07-22', startTime: '10:00', endTime: '12:00', capacity: 18 },
  
  // Urgench - B2
  { levelId: 3, region: 'urgench', address: 'Urgench - Xorezm Markazi', examDate: '2026-06-26', startTime: '11:00', endTime: '13:30', capacity: 15 },
  { levelId: 3, region: 'urgench', address: 'Urgench - Xorezm Markazi', examDate: '2026-07-26', startTime: '11:00', endTime: '13:30', capacity: 15 },
  
  // Kashkadarya - C1
  { levelId: 4, region: 'kashkadarya', address: 'Kashkadarya - Qarshi Shahri', examDate: '2026-07-01', startTime: '14:00', endTime: '16:30', capacity: 12 },
  { levelId: 4, region: 'kashkadarya', address: 'Kashkadarya - Qarshi Shahri', examDate: '2026-08-01', startTime: '14:00', endTime: '16:30', capacity: 12 },
];

try {
  console.log('Namunaviy imtihon kunlarini qo\'shmoqda...');
  
  for (const exam of sampleExams) {
    const query = `
      INSERT INTO exams (levelId, region, address, examDate, startTime, endTime, capacity, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    await connection.execute(query, [
      exam.levelId,
      exam.region,
      exam.address,
      exam.examDate,
      exam.startTime,
      exam.endTime,
      exam.capacity,
    ]);
  }
  
  console.log(`✅ ${sampleExams.length} ta imtihon kuni qo'shildi!`);
  console.log('\nQo\'shilgan imtihon kunlari:');
  sampleExams.forEach(exam => {
    console.log(`- ${exam.region}: ${exam.examDate} ${exam.startTime}-${exam.endTime} (Level ${exam.levelId})`);
  });
  
} catch (error) {
  console.error('Xato:', error.message);
} finally {
  await connection.end();
}
