const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Tag = sequelize.define('Tag', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: [1, 50]
    }
  },
  slug: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: [1, 50]
    }
  }
}, {
  tableName: 'tags',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeCreate: (tag) => {
      if (!tag.slug && tag.name) {
        tag.slug = tag.name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim();
      }
    },
    beforeUpdate: (tag) => {
      if (tag.changed('name') && !tag.slug) {
        tag.slug = tag.name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim();
      }
    }
  }
});

// 類別方法
Tag.findBySlug = function(slug) {
  return this.findOne({ where: { slug } });
};

Tag.findPopular = function(limit = 10) {
  return this.findAll({
    order: [['createdAt', 'DESC']],
    limit
  });
};

module.exports = Tag;
