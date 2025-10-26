const { sequelize } = require('../../config/database');
const User = require('./User');
const Post = require('./Post');
const Category = require('./Category');
const Tag = require('./Tag');
const Comment = require('./Comment');
const Setting = require('./Setting');
const Platform = require('./Platform');
const PlatformConnection = require('./PlatformConnection');
const DataMetric = require('./DataMetric');
const Dashboard = require('./Dashboard');
const Widget = require('./Widget');

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

// 數據平台關聯
User.hasMany(PlatformConnection, { foreignKey: 'userId', as: 'connections' });
PlatformConnection.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Platform.hasMany(PlatformConnection, { foreignKey: 'platformId', as: 'connections' });
PlatformConnection.belongsTo(Platform, { foreignKey: 'platformId', as: 'platform' });

PlatformConnection.hasMany(DataMetric, { foreignKey: 'connectionId', as: 'metrics' });
DataMetric.belongsTo(PlatformConnection, { foreignKey: 'connectionId', as: 'connection' });

User.hasMany(Dashboard, { foreignKey: 'userId', as: 'dashboards' });
Dashboard.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Dashboard.hasMany(Widget, { foreignKey: 'dashboardId', as: 'widgets' });
Widget.belongsTo(Dashboard, { foreignKey: 'dashboardId', as: 'dashboard' });

// 導出所有模型
module.exports = {
  sequelize,
  User,
  Post,
  Category,
  Tag,
  Comment,
  Setting,
  Platform,
  PlatformConnection,
  DataMetric,
  Dashboard,
  Widget
};
