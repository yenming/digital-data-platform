const { sequelize } = require('../../config/database');
const User = require('./User');
const Post = require('./Post');
const Category = require('./Category');
const Tag = require('./Tag');
const Comment = require('./Comment');
const Setting = require('./Setting');

// 定義關聯
User.hasMany(Post, { foreignKey: 'authorId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

Post.belongsToMany(Category, { 
  through: 'post_categories', 
  foreignKey: 'post_id',
  otherKey: 'category_id',
  as: 'categories'
});
Category.belongsToMany(Post, { 
  through: 'post_categories', 
  foreignKey: 'category_id',
  otherKey: 'post_id',
  as: 'posts'
});

Post.belongsToMany(Tag, { 
  through: 'post_tags', 
  foreignKey: 'post_id',
  otherKey: 'tag_id',
  as: 'tags'
});
Tag.belongsToMany(Post, { 
  through: 'post_tags', 
  foreignKey: 'tag_id',
  otherKey: 'post_id',
  as: 'posts'
});

Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Comment.hasMany(Comment, { foreignKey: 'parentId', as: 'replies' });
Comment.belongsTo(Comment, { foreignKey: 'parentId', as: 'parent' });

Category.hasMany(Category, { foreignKey: 'parentId', as: 'children' });
Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent' });

// 導出所有模型
module.exports = {
  sequelize,
  User,
  Post,
  Category,
  Tag,
  Comment,
  Setting
};
