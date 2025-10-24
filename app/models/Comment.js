const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  postId: {
    type: DataTypes.INTEGER,
    field: 'post_id',
    allowNull: false,
    references: {
      model: 'posts',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    field: 'user_id',
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  parentId: {
    type: DataTypes.INTEGER,
    field: 'parent_id',
    allowNull: true,
    references: {
      model: 'comments',
      key: 'id'
    }
  },
  authorName: {
    type: DataTypes.STRING(100),
    field: 'author_name',
    allowNull: true
  },
  authorEmail: {
    type: DataTypes.STRING(100),
    field: 'author_email',
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [1, 1000]
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'comments',
  timestamps: true,
  underscored: true
});

// 實例方法
Comment.prototype.isApproved = function() {
  return this.status === 'approved';
};

Comment.prototype.isPending = function() {
  return this.status === 'pending';
};

Comment.prototype.isRejected = function() {
  return this.status === 'rejected';
};

Comment.prototype.approve = function() {
  this.status = 'approved';
  return this.save();
};

Comment.prototype.reject = function() {
  this.status = 'rejected';
  return this.save();
};

// 類別方法
Comment.findByPost = function(postId) {
  return this.findAll({
    where: { 
      postId,
      status: 'approved'
    },
    order: [['createdAt', 'ASC']]
  });
};

Comment.findPending = function() {
  return this.findAll({
    where: { status: 'pending' },
    order: [['createdAt', 'DESC']]
  });
};

Comment.findApproved = function() {
  return this.findAll({
    where: { status: 'approved' },
    order: [['createdAt', 'DESC']]
  });
};

module.exports = Comment;
