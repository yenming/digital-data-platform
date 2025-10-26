'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 更新 role 欄位
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('system_admin', 'agent', 'brand', 'individual'),
      defaultValue: 'individual',
      allowNull: false,
      comment: '角色：system_admin(系統管理員), agent(代理商), brand(品牌), individual(個人經營)'
    });

    // 添加 parentUserId 欄位
    await queryInterface.addColumn('users', 'parentUserId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      comment: '上級用戶ID（用於權限管理）'
    });

    // 添加 permissions 欄位
    await queryInterface.addColumn('users', 'permissions', {
      type: Sequelize.JSON,
      allowNull: true,
      comment: '用戶權限配置（JSON格式）'
    });

    // 添加索引
    await queryInterface.addIndex('users', ['parentUserId']);
    await queryInterface.addIndex('users', ['role']);
  },

  async down(queryInterface, Sequelize) {
    // 移除索引
    await queryInterface.removeIndex('users', ['parentUserId']);
    await queryInterface.removeIndex('users', ['role']);

    // 移除欄位
    await queryInterface.removeColumn('users', 'permissions');
    await queryInterface.removeColumn('users', 'parentUserId');

    // 恢復原來的 role 欄位
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('admin', 'user'),
      defaultValue: 'user',
      allowNull: false,
      comment: '角色'
    });
  }
};
