require('dotenv').config({ path: '.env.development' });
const db = require('../models');
const { faker } = require('@faker-js/faker');

async function seedTransactions() {
  try {
    const userId = 1;
    const transactionTypes = ['income', 'expense'];
    const currencies = ['BRL', 'USD', 'EUR'];

    // Create 100 transactions for user with ID 1
    for (let i = 0; i < 100; i++) {
      await db.transaction.create({
        user_id: userId,
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

      // Log progress
      if ((i + 1) % 10 === 0) {
        console.log(`Created ${i + 1} transactions...`);
      }
    }

    console.log('Successfully created 100 transactions for user with ID 1!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding transactions:', error);
    process.exit(1);
  }
}

// Run seeder
seedTransactions();