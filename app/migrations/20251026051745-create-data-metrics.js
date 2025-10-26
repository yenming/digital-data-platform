'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('data_metrics', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      connection_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'platform_connections',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      metric_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      metric_value: {
        type: Sequelize.DECIMAL(15, 4),
        allowNull: false
      },
      metric_type: {
        type: Sequelize.ENUM('count', 'rate', 'currency', 'percentage', 'duration'),
        allowNull: false
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      hour: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      dimension1: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      dimension2: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      dimension3: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      raw_data: {
        type: Sequelize.JSON,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // 添加索引
    await queryInterface.addIndex('data_metrics', ['connection_id', 'metric_name', 'date'], {
      name: 'idx_connection_metric_date'
    });
    await queryInterface.addIndex('data_metrics', ['date'], {
      name: 'idx_date'
    });
    await queryInterface.addIndex('data_metrics', ['metric_name'], {
      name: 'idx_metric_name'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('data_metrics');
  }
};
