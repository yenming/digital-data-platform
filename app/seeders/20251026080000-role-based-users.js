'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password123', 12);

    // 創建系統管理員
    await queryInterface.bulkInsert('users', [
      {
        username: 'system_admin',
        email: 'admin@digital-data-platform.com',
        password: hashedPassword,
        first_name: 'System',
        last_name: 'Administrator',
        role: 'system_admin',
        parentUserId: null,
        permissions: JSON.stringify({
          users: ['*'],
          platforms: ['*'],
          analytics: ['*'],
          reports: ['*']
        }),
        isActive: true,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // 創建代理商
    await queryInterface.bulkInsert('users', [
      {
        username: 'agent_user',
        email: 'agent@digital-data-platform.com',
        password: hashedPassword,
        first_name: 'Agent',
        last_name: 'User',
        role: 'agent',
        parentUserId: 1, // 系統管理員的ID
        permissions: JSON.stringify({
          users: ['read', 'write'],
          platforms: ['*'],
          analytics: ['*'],
          reports: ['*']
        }),
        isActive: true,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // 創建品牌用戶
    await queryInterface.bulkInsert('users', [
      {
        username: 'brand_user',
        email: 'brand@digital-data-platform.com',
        password: hashedPassword,
        first_name: 'Brand',
        last_name: 'User',
        role: 'brand',
        parentUserId: 2, // 代理商的ID
        permissions: JSON.stringify({
          platforms: ['read', 'write'],
          analytics: ['read'],
          reports: ['read']
        }),
        isActive: true,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // 創建個人經營用戶
    await queryInterface.bulkInsert('users', [
      {
        username: 'individual_user',
        email: 'individual@digital-data-platform.com',
        password: hashedPassword,
        first_name: 'Individual',
        last_name: 'User',
        role: 'individual',
        parentUserId: 2, // 代理商的ID
        permissions: JSON.stringify({
          platforms: ['read'],
          analytics: ['read']
        }),
        isActive: true,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // 更新現有的測試用戶角色
    await queryInterface.bulkUpdate('users', 
      { 
        role: 'individual',
        parentUserId: 2,
        permissions: JSON.stringify({
          platforms: ['read'],
          analytics: ['read']
        }),
        updatedAt: new Date()
      },
      { 
        email: 'test@digital-data-platform.com' 
      }
    );
  },

  async down(queryInterface, Sequelize) {
    // 刪除創建的用戶
    await queryInterface.bulkDelete('users', {
      email: [
        'admin@digital-data-platform.com',
        'agent@digital-data-platform.com',
        'brand@digital-data-platform.com',
        'individual@digital-data-platform.com'
      ]
    });

    // 恢復測試用戶的原始角色
    await queryInterface.bulkUpdate('users', 
      { 
        role: 'user',
        parentUserId: null,
        permissions: null,
        updatedAt: new Date()
      },
      { 
        email: 'test@digital-data-platform.com' 
      }
    );
  }
};
