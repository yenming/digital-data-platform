const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: '使用者名稱'
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: '電子郵件'
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '密碼'
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '名字'
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '姓氏'
    },
            role: {
              type: DataTypes.ENUM('system_admin', 'agent', 'brand', 'individual'),
              defaultValue: 'individual',
              comment: '角色：system_admin(系統管理員), agent(代理商), brand(品牌), individual(個人經營)'
            },
            parentUserId: {
              type: DataTypes.INTEGER,
              allowNull: true,
              references: {
                model: 'users',
                key: 'id'
              },
              comment: '上級用戶ID（用於權限管理）'
            },
            permissions: {
              type: DataTypes.JSON,
              allowNull: true,
              comment: '用戶權限配置（JSON格式）'
            },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: '是否啟用'
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: '電子郵件是否驗證'
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '最後登入時間'
    }
  }, {
    tableName: 'users',
    timestamps: true,
    comment: '使用者表'
  });

  return User;
};
