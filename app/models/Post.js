const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      len: [1, 200]
    }
  },
  slug: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique: true,
    validate: {
      len: [1, 200]
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  featuredImage: {
    type: DataTypes.STRING(255),
    field: 'featured_image',
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft'
  },
  authorId: {
    type: DataTypes.INTEGER,
    field: 'author_id',
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'posts',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeCreate: (post) => {
      if (!post.slug && post.title) {
        post.slug = post.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim();
      }
    },
    beforeUpdate: (post) => {
      if (post.changed('title') && !post.slug) {
        post.slug = post.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim();
      }
    }
  }
});

// 實例方法
Post.prototype.incrementViews = function() {
  this.views += 1;
  return this.save();
};

Post.prototype.isPublished = function() {
  return this.status === 'published';
};

Post.prototype.getExcerpt = function(length = 150) {
  if (!this.excerpt && this.content) {
    return this.content.substring(0, length) + (this.content.length > length ? '...' : '');
  }
  return this.excerpt;
};

// 類別方法
Post.findPublished = function() {
  return this.findAll({
    where: { status: 'published' },
    order: [['createdAt', 'DESC']]
  });
};

Post.findBySlug = function(slug) {
  return this.findOne({ where: { slug } });
};

Post.findByAuthor = function(authorId) {
  return this.findAll({
    where: { authorId },
    order: [['createdAt', 'DESC']]
  });
};

Post.search = function(query) {
  return this.findAll({
    where: {
      [sequelize.Op.or]: [
        { title: { [sequelize.Op.like]: `%${query}%` } },
        { content: { [sequelize.Op.like]: `%${query}%` } }
      ],
      status: 'published'
    },
    order: [['createdAt', 'DESC']]
  });
};

module.exports = Post;
