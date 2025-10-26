'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 先更新現有用戶的角色
    await queryInterface.bulkUpdate('users', 
      { role: 'system_admin' },
      { role: 'admin' }
    );
    
    await queryInterface.bulkUpdate('users', 
      { role: 'individual' },
      { role: 'user' }
    );
  },

  async down(queryInterface, Sequelize) {
    // 恢復原來的角色
    await queryInterface.bulkUpdate('users', 
      { role: 'admin' },
      { role: 'system_admin' }
    );
    
    await queryInterface.bulkUpdate('users', 
      { role: 'user' },
      { role: 'individual' }
    );
  }
};
