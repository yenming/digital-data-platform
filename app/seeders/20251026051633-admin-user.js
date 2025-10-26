'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 先檢查是否已有 admin 用戶
    const existingAdmin = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM users WHERE username = "admin"',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    if (existingAdmin[0].count > 0) {
      console.log('Admin user already exists, skipping seed');
      return;
    }
    
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        email: 'admin@digital-data-platform.com',
        password: hashedPassword,
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin',
        is_active: true,
        email_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { username: 'admin' }, {});
  }
};