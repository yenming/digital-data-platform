const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Setting = sequelize.define('Setting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  keyName: {
    type: DataTypes.STRING(100),
    field: 'key_name',
    allowNull: false,
    unique: true,
    validate: {
      len: [1, 100]
    }
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'settings',
  timestamps: true,
  underscored: true
});

// 類別方法
Setting.get = async function(keyName) {
  const setting = await this.findOne({ where: { keyName } });
  return setting ? setting.value : null;
};

Setting.set = async function(keyName, value, description = null) {
  const [setting, created] = await this.findOrCreate({
    where: { keyName },
    defaults: { value, description }
  });
  
  if (!created) {
    setting.value = value;
    if (description) setting.description = description;
    await setting.save();
  }
  
  return setting;
};

Setting.getAll = function() {
  return this.findAll({
    order: [['keyName', 'ASC']]
  });
};

Setting.delete = function(keyName) {
  return this.destroy({ where: { keyName } });
};

module.exports = Setting;
