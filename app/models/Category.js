const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [1, 100]
    }
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      len: [1, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  parentId: {
    type: DataTypes.INTEGER,
    field: 'parent_id',
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    }
  }
}, {
  tableName: 'categories',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeCreate: (category) => {
      if (!category.slug && category.name) {
        category.slug = category.name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim();
      }
    },
    beforeUpdate: (category) => {
      if (category.changed('name') && !category.slug) {
        category.slug = category.name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim();
      }
    }
  }
});

// 實例方法
Category.prototype.isParent = function() {
  return this.parentId === null;
};

Category.prototype.isChild = function() {
  return this.parentId !== null;
};

// 類別方法
Category.findBySlug = function(slug) {
  return this.findOne({ where: { slug } });
};

Category.findParents = function() {
  return this.findAll({
    where: { parentId: null },
    order: [['name', 'ASC']]
  });
};

Category.findChildren = function(parentId) {
  return this.findAll({
    where: { parentId },
    order: [['name', 'ASC']]
  });
};

module.exports = Category;
