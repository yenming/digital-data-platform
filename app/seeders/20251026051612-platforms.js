'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 先檢查是否已有數據
    const existingPlatforms = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM platforms',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    if (existingPlatforms[0].count > 0) {
      console.log('Platforms already exist, skipping seed');
      return;
    }
    
    await queryInterface.bulkInsert('platforms', [
      {
        name: 'Meta Ads',
        display_name: 'Meta Ads',
        type: 'advertising',
        auth_type: 'oauth2',
        is_active: true,
        icon: 'fab fa-facebook',
        color: '#1877F2',
        description: 'Facebook 廣告平台',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Google Analytics',
        display_name: 'Google Analytics 4',
        type: 'analytics',
        auth_type: 'oauth2',
        is_active: true,
        icon: 'fab fa-google',
        color: '#EA4335',
        description: 'Google Analytics 4 網站分析',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Instagram',
        display_name: 'Instagram',
        type: 'social',
        auth_type: 'oauth2',
        is_active: true,
        icon: 'fab fa-instagram',
        color: '#E4405F',
        description: 'Instagram 社交媒體平台',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Search Console',
        display_name: 'Google Search Console',
        type: 'search',
        auth_type: 'oauth2',
        is_active: true,
        icon: 'fab fa-google',
        color: '#34A853',
        description: 'Google 搜尋控制台',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Google Ads',
        display_name: 'Google Ads',
        type: 'advertising',
        auth_type: 'oauth2',
        is_active: true,
        icon: 'fab fa-google',
        color: '#4285F4',
        description: 'Google 廣告平台',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Line LAP',
        display_name: 'Line LAP',
        type: 'messaging',
        auth_type: 'api_key',
        is_active: true,
        icon: 'fab fa-line',
        color: '#00C300',
        description: 'Line 官方帳號平台',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('platforms', null, {});
  }
};