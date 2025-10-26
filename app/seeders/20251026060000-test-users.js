'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 檢查是否已有測試用戶
    const existingTestUser = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM users WHERE username = "testuser"',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    if (existingTestUser[0].count > 0) {
      console.log('Test users already exist, skipping seed');
      return;
    }
    
    const hashedPassword = await bcrypt.hash('test123', 12);
    
    await queryInterface.bulkInsert('users', [
      {
        username: 'testuser',
        email: 'test@digital-data-platform.com',
        password: hashedPassword,
        first_name: 'Test',
        last_name: 'User',
        role: 'user',
        is_active: true,
        email_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'demo',
        email: 'demo@digital-data-platform.com',
        password: hashedPassword,
        first_name: 'Demo',
        last_name: 'User',
        role: 'user',
        is_active: true,
        email_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
    
    console.log('Test users created successfully');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { 
      username: ['testuser', 'demo'] 
    }, {});
  }
};
