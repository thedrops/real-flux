require('dotenv').config({ path: '.env.development' });
const db = require('../models');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

async function seedDatabase() {
  try {
    // Create demo users
    const users = [];
    for (let i = 0; i < 5; i++) {
      const user = await db.user.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: bcrypt.hashSync('Test@123', 8)
      });
      users.push(user);
    }

    // Create transactions for each user
    const transactionTypes = ['income', 'expense'];
    const currencies = ['BRL', 'USD', 'EUR'];

    for (const user of users) {
      // Create 20 transactions per user
      for (let i = 0; i < 20; i++) {
        await db.transaction.create({
          user_id: user.id,
          description: faker.commerce.productName(),
          amount: parseFloat(faker.finance.amount(100, 10000, 2)),
          currency: faker.helpers.arrayElement(currencies),
          exchange_rate: parseFloat(faker.finance.amount(0.8, 5.5, 4)),
          transaction_type: faker.helpers.arrayElement(transactionTypes),
          transaction_date: faker.date.between({ 
            from: '2025-01-01', 
            to: '2025-04-11' 
          })
        });
      }
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeder
seedDatabase();
