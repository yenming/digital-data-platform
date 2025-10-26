'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('widgets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dashboard_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'dashboards',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      type: {
        type: Sequelize.ENUM('chart', 'table', 'kpi', 'gauge', 'map', 'funnel', 'trend'),
        allowNull: false
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      position: {
        type: Sequelize.JSON,
        allowNull: false
      },
      config: {
        type: Sequelize.JSON,
        allowNull: false
      },
      data_source: {
        type: Sequelize.JSON,
        allowNull: false
      },
      filters: {
        type: Sequelize.JSON,
        allowNull: true
      },
      refresh_interval: {
        type: Sequelize.INTEGER,
        defaultValue: 300
      },
      is_visible: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      sort_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('widgets');
  }
};
