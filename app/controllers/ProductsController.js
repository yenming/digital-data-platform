class ProductsController {
  // 產品中心首頁
  static async index(req, res) {
    try {
      const products = {
        delivery: [
          {
            id: 1,
            name: 'LuckiBot',
            category: '遞送服務型機器人',
            description: '基礎型遞送服務型機器人。LuckiBot 是一款專為餐廳、企業、醫院、飯店、超市、養老院等多個場景設計的智能行銷遞送機器人。配備10吋高清觸控螢幕，支援圖片、影片及音檔播放，讓您的行銷宣傳更加靈活有效。採用先進的AI技術，提供24小時不間斷的智慧服務，大幅提升營運效率與顧客體驗。',
            features: ['餐點遞送', '餐盤回收', '移動推廣', '定點攬客', '語音互動', '引領領位', '智能點餐', '跨樓層遞送'],
            image: '/images/products/luckibot/luckibot.jpg',
            gallery: [
              '/images/products/luckibot/luckibot1.jpg',
              '/images/products/luckibot/luckibot2.jpg'
            ]
          },
          {
            id: 2,
            name: 'LuckiBot Pro',
            category: '遞送服務型機器人',
            description: '進階型遞送服務型機器人。擁有170° 3D，240°平面全方位識別障礙物能力，並且14吋超大高清螢幕，可視面積增加92%，同時視覺定位能力增強，視野盲區進一步縮小，可識別小物體障礙物，懸空物體識別靈敏度再提高，搭載下視RGBD，完美地面感知能力，規避低矮障礙與壓腳碰撞風險。',
            features: ['專業交互體驗', '專業遞送效率', '專業行銷推廣', '專業招攬帶位', '專業高擴展能力', '智能點餐', '跨樓層遞送'],
            image: '/images/products/luckibot-pro/luckibot-pro.jpg',
            gallery: [
              '/images/products/luckibot-pro/luckibot-pro2.jpg',
              '/images/products/luckibot-pro/luckibot-pro3.png',
              '/images/products/luckibot-pro/luckibot-pro4.png'
            ]
          },
          {
            id: 3,
            name: 'LuckiBot Pro Autodoor',
            category: '遞送服務型機器人',
            description: '自動門版遞送服務型機器人。138公升超大儲物空間、四片鷹翼門板、密封遞送智慧密碼鎖功能，可為餐廳、飯店、KTV、工廠、醫院、提供客製化解決方案，滿足密封遞送和安全隱私的需求。',
            features: ['安全遞送', '感知升級', '人機交互', '營銷推廣', '四片鷹翼門板', '自動智能密碼鎖', '魔術空間', '智慧導航'],
            image: '/images/products/luckibot-pro-autodoor/luckibot-pro-autodoor1.png',
            gallery: [
              '/images/products/luckibot-pro-autodoor/luckibot-pro-autodoor2.png',
              '/images/products/luckibot-pro-autodoor/luckibot-pro-autodoor3.png',
              '/images/products/luckibot-pro-autodoor/luckibot-pro-autodoor4.png'
            ]
          }
        ],
        greeting: [
          {
            id: 4,
            name: 'GreetingBot Mini',
            category: '接待服務型機器人',
            description: '迷你型迎賓服務型機器人。具備 Ai 語音對話能力，可以實現迎賓接待、問答諮詢、導覽講解、廣告宣傳、遠程控制等功能，能針對不場景客製化，獨立執行特定功能或是與企業內部系統協同運作。適用於前檯帶位、展售中心、展覽會場或需要導覽講解的各類場域。',
            features: ['迎賓接待功能', '智能引導功能', '行銷宣傳功能', 'AI語音互動', '資訊諮詢服務', '系統管理功能'],
            image: '/images/products/mini/greeting-robot-mini.jpg',
            gallery: [
              '/images/products/mini/mini2.png',
              '/images/products/mini/mini3.png',
              '/images/products/mini/mini4.png'
            ]
          },
          {
            id: 5,
            name: 'GreetingBot Nova',
            category: '接待服務型機器人',
            description: '大語言模型接待服務型機器人。GreetingBot Nova 是獵戶星空為全球市場推出的首款大語言模型機器人，具有頂尖的導航和定制能力。它擁有全新的設計，配備更多的硬體介面和外圍空間。最重要的是，搭載大型語言模型後，Nova 能夠更智慧地進行互動，輕鬆應對接待、導覽和解說等任務。',
            features: ['大語言模型技術', '身臨其境互動體驗', '升級定制能力', '流暢語音互動', '增強導航系統', '卓越性能'],
            image: '/images/products/nova/greetingbot-nova.jpg',
            gallery: [
              '/images/products/nova/nova1.jpg',
              '/images/products/nova/nova2.jpg',
              '/images/products/nova/nova3.jpg',
              '/images/products/nova/nova4.jpg'
            ]
          },
          {
            id: 6,
            name: 'LuckiBot Plus',
            category: '接待服務型機器人',
            description: '專業型迎賓服務型機器人。配置27吋高畫質螢幕，可為業界客戶提供更豐富的宣傳內容展示，行銷宣傳，還可實現語音互動、導覽引領、自訂大螢幕背景、遠端操控等功能，相信會是您吸引流量、智慧行銷、智慧服務升級的秘密武器！',
            features: ['影片廣告播放', '精準語音辨識', '智能避障定位', '多功能應用', '27吋高畫質螢幕', '97%語音辨識率'],
            image: '/images/products/plus/luckibot-plus.jpg',
            gallery: [
              '/images/products/plus/plus1.jpeg',
              '/images/products/plus/plus2.jpeg',
              '/images/products/plus/plus3.jpeg'
            ]
          }
        ],
        industrial: [
          {
            id: 7,
            name: 'CarryBot',
            category: '工業配送型機器人',
            description: '自主移動機器人 (AMR)。是一款自主移動機器人（AMR），專為消費電子、倉儲、物流等領域的間斷式製造企業所設計。該產品具備自主導航功能、效能穩定的避障感測器、強大負載能力、多層安全防護，助力企業實現智慧製造，確保靈活且安全的遞送。',
            features: ['智能路徑規劃', '多機協同調度', '自動充電管理', '遠端監控系統', '最大載重150kg', '智能跟隨'],
            image: '/images/products/carrybot/carrybot.jpg',
            gallery: [
              '/images/products/carrybot/carry1.png',
              '/images/products/carrybot/carry2.png',
              '/images/products/carrybot/carry3.png',
              '/images/products/carrybot/carry5.png'
            ]
          }
        ],
        cleaning: [
          {
            id: 8,
            name: 'CleanMart',
            category: '清潔機器人',
            description: '專為小型綜合商場環境量身定制的智能清潔機器人，集清潔與商品促銷雙重功能於一體。採用先進的自主導航技術，自動規劃清掃路徑，時尚外觀設計配備陳列區和廣告屏，為您的商業空間帶來全新的清潔體驗。',
            features: ['智能導航系統', '一體化清潔系統', '智能控制與管理', '商業促銷功能', '智能充電系統', '掃吸拖一體化'],
            image: '/images/products/cleanMart/j30-main.jpg',
            gallery: [
              '/images/products/cleanMart/j30-main2.jpg',
              '/images/products/cleanMart/j30-2.jpg'
            ]
          },
          {
            id: 9,
            name: 'OrionStar CleaniBot AI',
            category: '清潔機器人',
            description: 'OrionStar CleaniBot AI 清潔機器人採用先進的 AI 技術，提供全自動化清潔解決方案。搭載 InstantClean 地面護理解決方案，可同時進行掃地、刷洗、吸塵、拖地、自清潔、消毒等多種功能，為您的商業空間帶來革命性的清潔體驗。',
            features: ['全自動化操作', '多功能一體式清潔', '超靜音運作', '優異清潔效能', '智慧導航系統', '消毒系統'],
            image: '/images/products/cleaning-robot/cleaning-robot-main.jpg',
            gallery: [
              '/images/products/cleaning-robot/cleaning-robot-main2.jpg'
            ]
          }
        ]
      };

      res.render('products/index', {
        title: '產品中心',
        page: 'products',
        products
      });
    } catch (error) {
      console.error('產品中心頁面錯誤:', error);
      res.status(500).render('errors/500', {
        title: '伺服器錯誤',
        message: '載入產品中心頁面時發生錯誤'
      });
    }
  }

  // 產品詳情頁面
  static async detail(req, res) {
    try {
      const { id } = req.params;
      
      // 產品數據庫
      const productsData = {
        1: {
          id: 1,
          name: 'LuckiBot',
          category: '遞送服務型機器人',
          description: '基礎型遞送服務型機器人。LuckiBot 是一款專為餐廳、企業、醫院、飯店、超市、養老院等多個場景設計的智能行銷遞送機器人。配備10吋高清觸控螢幕，支援圖片、影片及音檔播放，讓您的行銷宣傳更加靈活有效。採用先進的AI技術，提供24小時不間斷的智慧服務，大幅提升營運效率與顧客體驗。',
          features: ['餐點遞送', '餐盤回收', '移動推廣', '定點攬客', '語音互動', '引領領位', '智能點餐', '跨樓層遞送'],
          specifications: {
            '外形尺寸': '530mm × 500mm × 1320mm',
            '螢幕尺寸': '10.1吋，1200×1920',
            '通過寬度': '650mm',
            '爬坡能力': '5~10度',
            '機體重量': '39kg',
            '單層載重': '15kg',
            '整機載重': '最大負載45kg',
            '托盤數量': '托盤層數可調，標配3層',
            '托盤大小': '第1和2層托盤尺寸500mm×430mm，底層托盤尺寸480mm×400mm',
            '巡航速度': '0.1~1.2m/s（可調式）',
            '麥克風': '6陣列麥克風',
            'RGBD': '1顆',
            '雷射雷達': '1顆',
            '定位精準度': '釐米級',
            '越障能力': '溝槽寬度≤20mm，過坎高度≤10mm',
            '網路支援': '4G（支持Sim卡），Wifi：支持2.4G/5G Wifi',
            '多機模式': '同場域至多30台',
            '充電方式': '手動充電(線充)，自動回充(座充)（選配）',
            '充電樁體積': '204mm × 221mm × 251mm',
            '電池材質/容量': '三元鋰電池，15.15Ah/25.2V',
            '充電時間': '3小時',
            '續航時間': '12-14小時'
          },
          image: '/images/products/luckibot/luckibot.jpg',
          gallery: [
            '/images/products/luckibot/luckibot1.jpg',
            '/images/products/luckibot/luckibot2.jpg'
          ]
        },
        2: {
          id: 2,
          name: 'LuckiBot Pro',
          category: '遞送服務型機器人',
          description: '進階型遞送服務型機器人。擁有170° 3D，240°平面全方位識別障礙物能力，並且14吋超大高清螢幕，可視面積增加92%，同時視覺定位能力增強，視野盲區進一步縮小，可識別小物體障礙物，懸空物體識別靈敏度再提高，搭載下視RGBD，完美地面感知能力，規避低矮障礙與壓腳碰撞風險。',
          features: ['專業交互體驗', '專業遞送效率', '專業行銷推廣', '專業招攬帶位', '專業高擴展能力', '智能點餐', '跨樓層遞送'],
          specifications: {
            '外形尺寸': '558mm × 525mm × 1375mm',
            '螢幕尺寸': '14吋，1080 FHD',
            '通過寬度': '700mm',
            '爬坡能力': '5~10度',
            '機體重量': '59kg',
            '單層載重': '20kg',
            '整機載重': '最大負載60kg',
            '托盤數量': '托盤層數可調，標配3層',
            '托盤大小': '500mm × 420mm',
            '巡航速度': '0.1~1.2m/s（可調）',
            '麥克風': '6陣列麥克風',
            'RGBD': '3顆',
            '雷射雷達': '1顆',
            '定位精準度': '釐米級',
            '越障能力': '溝槽寬度≤20mm，過坎高度≤10mm',
            '網路支援': '4G（支持Sim卡），Wifi：支持2.4G/5G Wifi',
            '多機模式': '同場域至多30台',
            '充電方式': '手動充電(線充)，自動回充(座充)',
            '充電樁體積': '350mm × 142mm × 342mm',
            '電池材質/容量': '三元鋰電池，24.3Ah/25.55V',
            '充電時間': '4小時',
            '續航時間': '12-14小時'
          },
          image: '/images/products/luckibot-pro/luckibot-pro.jpg',
          gallery: [
            '/images/products/luckibot-pro/luckibot-pro2.jpg',
            '/images/products/luckibot-pro/luckibot-pro3.png',
            '/images/products/luckibot-pro/luckibot-pro4.png'
          ]
        },
        3: {
          id: 3,
          name: 'LuckiBot Pro Autodoor',
          category: '遞送服務型機器人',
          description: '自動門版遞送服務型機器人。138公升超大儲物空間、四片鷹翼門板、密封遞送智慧密碼鎖功能，可為餐廳、飯店、KTV、工廠、醫院、提供客製化解決方案，滿足密封遞送和安全隱私的需求。',
          features: ['安全遞送', '感知升級', '人機交互', '營銷推廣', '四片鷹翼門板', '自動智能密碼鎖', '魔術空間', '智慧導航'],
          specifications: {
            '外形尺寸': '558mm × 525mm × 1375mm',
            '螢幕尺寸': '14吋，1080 FHD',
            '通過寬度': '700mm',
            '爬坡能力': '5~10度',
            '機體重量': '59kg',
            '單層載重': '20kg',
            '整機載重': '最大負載40kg',
            '托盤數量': '2層',
            '托盤大小': '410mm × 480mm × 315mm',
            '巡航速度': '0.1~1.2m/s（可調）',
            '麥克風': '6陣列麥克風',
            'RGBD': '3顆',
            '雷射雷達': '1顆',
            '定位精準度': '釐米級',
            '越障能力': '溝槽寬度≤20mm，過坎高度≤10mm',
            '網路支援': '4G（支持Sim卡），Wifi：支持2.4G/5G Wifi',
            '多機模式': '同場域至多30台',
            '充電方式': '手動充電(線充)，自動回充(座充)',
            '充電樁體積': '350mm × 142mm × 342mm',
            '電池材質/容量': '三元鋰電池，24.3Ah/25.55V',
            '充電時間': '4小時',
            '續航時間': '12-14小時'
          },
          image: '/images/products/luckibot-pro-autodoor/luckibot-pro-autodoor1.png',
          gallery: [
            '/images/products/luckibot-pro-autodoor/luckibot-pro-autodoor2.png',
            '/images/products/luckibot-pro-autodoor/luckibot-pro-autodoor3.png',
            '/images/products/luckibot-pro-autodoor/luckibot-pro-autodoor4.png'
          ]
        },
        4: {
          id: 4,
          name: 'GreetingBot Mini',
          category: '接待服務型機器人',
          description: '迷你型迎賓服務型機器人。具備 Ai 語音對話能力，可以實現迎賓接待、問答諮詢、導覽講解、廣告宣傳、遠程控制等功能，能針對不場景客製化，獨立執行特定功能或是與企業內部系統協同運作。適用於前檯帶位、展售中心、展覽會場或需要導覽講解的各類場域。',
          features: ['迎賓接待功能', '智能引導功能', '行銷宣傳功能', 'AI語音互動', '資訊諮詢服務', '系統管理功能'],
          specifications: {
            '外形尺寸': '1000mm × 410mm × 410mm',
            '螢幕尺寸': '14吋，1080 FHD',
            '通過寬度': '500mm',
            '爬坡能力': '5~10度',
            '機體重量': '21kg',
            '巡航速度': '0.1~1.2m/s（可調）',
            '麥克風': '6陣列麥克風',
            'RGBD': '1顆',
            '雷射雷達': '1顆',
            '定位精準度': '釐米級',
            '越障能力': '溝槽寬度≤10mm，過坎高度≤10mm',
            '網路支援': '4G（支持Sim卡），Wifi：支持2.4G/5G Wifi',
            '多機模式': '同場域至多30台',
            '充電方式': '手動充電(線充)，自動回充(座充)',
            '充電樁體積': '204mm × 221mm × 251mm',
            '電池材質/容量': '三元鋰電池，12.12Ah/25.2V',
            '充電時間': '3小時',
            '續航時間': '12-14小時'
          },
          image: '/images/products/mini/greeting-robot-mini.jpg',
          gallery: [
            '/images/products/mini/mini2.png',
            '/images/products/mini/mini3.png',
            '/images/products/mini/mini4.png'
          ]
        },
        5: {
          id: 5,
          name: 'GreetingBot Nova',
          category: '接待服務型機器人',
          description: '大語言模型接待服務型機器人。GreetingBot Nova 是獵戶星空為全球市場推出的首款大語言模型機器人，具有頂尖的導航和定制能力。它擁有全新的設計，配備更多的硬體介面和外圍空間。最重要的是，搭載大型語言模型後，Nova 能夠更智慧地進行互動，輕鬆應對接待、導覽和解說等任務。',
          features: ['大語言模型技術', '身臨其境互動體驗', '升級定制能力', '流暢語音互動', '增強導航系統', '卓越性能'],
          specifications: {
            '整體尺寸': '558mm × 525mm × 1350mm',
            '淨重': '56公斤',
            '產品顏色': '銀色 + 青銅灰',
            '螢幕尺寸': '14英吋，1080 FHD',
            '頭部攝像頭': '1300萬像素高清攝像頭 × 1',
            '巡航速度': '0.5~1.2米/秒（可調）',
            '巡航時間': '12-14小時（典型巡航場景）',
            '充電時間': '4.5小時（使用充電座）',
            '充電模式': '自動充電座、充電線',
            '3D LiDAR': '170度視野範圍，240度水平平面',
            '語言支援': '30+種語言',
            '部署方式': '免標記部署'
          },
          image: '/images/products/nova/greetingbot-nova.jpg',
          gallery: [
            '/images/products/nova/nova1.jpg',
            '/images/products/nova/nova2.jpg',
            '/images/products/nova/nova3.jpg',
            '/images/products/nova/nova4.jpg'
          ]
        },
        6: {
          id: 6,
          name: 'LuckiBot Plus',
          category: '接待服務型機器人',
          description: '專業型迎賓服務型機器人。配置27吋高畫質螢幕，可為業界客戶提供更豐富的宣傳內容展示，行銷宣傳，還可實現語音互動、導覽引領、自訂大螢幕背景、遠端操控等功能，相信會是您吸引流量、智慧行銷、智慧服務升級的秘密武器！',
          features: ['影片廣告播放', '精準語音辨識', '智能避障定位', '多功能應用', '27吋高畫質螢幕', '97%語音辨識率'],
          specifications: {
            '外形尺寸': '530mm × 500mm × 1320mm',
            '螢幕尺寸': '互動螢幕(上)10.1英吋，1200×1920大螢幕(下)27英吋，1080×1920',
            '通過寬度': '650mm',
            '爬坡能力': '5~10度',
            '機體重量': '43kg',
            '巡航速度': '0.1~1.2m/s（可調）',
            '麥克風': '6陣列麥克風',
            'RGBD': '1顆',
            '雷射雷達': '1顆',
            '定位精準度': '釐米級',
            '越障能力': '溝槽寬度≤20mm，過坎高度≤10mm',
            '網路支援': '4G（支持Sim卡），Wifi：支持2.4G/5G Wifi',
            '多機模式': '同場域至多30台',
            '充電方式': '手動充電(線充)，自動回充(座充)',
            '充電樁體積': '204mm × 221mm × 251mm',
            '電池材質/容量': '三元鋰電池，24.3Ah/25.55V',
            '充電時間': '3小時',
            '續航時間': '9小時'
          },
          image: '/images/products/plus/luckibot-plus.jpg',
          gallery: [
            '/images/products/plus/plus1.jpeg',
            '/images/products/plus/plus2.jpeg',
            '/images/products/plus/plus3.jpeg'
          ]
        },
        7: {
          id: 7,
          name: 'CarryBot',
          category: '工業配送型機器人',
          description: '自主移動機器人 (AMR)。是一款自主移動機器人（AMR），專為消費電子、倉儲、物流等領域的間斷式製造企業所設計。該產品具備自主導航功能、效能穩定的避障感測器、強大負載能力、多層安全防護，助力企業實現智慧製造，確保靈活且安全的遞送。',
          features: ['智能路徑規劃', '多機協同調度', '自動充電管理', '遠端監控系統', '最大載重150kg', '智能跟隨'],
          specifications: {
            '外形尺寸': '650mm × 525mm × 1377mm',
            '螢幕尺寸': '14吋，1080 FHD',
            '通過寬度': '650mm',
            '爬坡能力': '5~10度',
            '機體重量': '48kg',
            '單層載重': '150kg',
            '整機載重': '最大負載150kg',
            '巡航速度': '0.3~1.0m/s（可調）',
            '麥克風': '6陣列麥克風',
            'RGBD': '3顆',
            '雷射雷達': '1顆',
            '定位精準度': '釐米級',
            '越障能力': '溝槽寬度≤20mm，過坎高度≤10mm',
            '網路支援': '4G（支持Sim卡），Wifi：支持2.4G/5G Wifi',
            '多機模式': '同場域至多30台',
            '充電方式': '手動充電(線充)，自動回充(座充)',
            '充電樁體積': '350mm × 142mm × 342mm',
            '電池材質/容量': '三元鋰電池，34Ah/25.2V',
            '充電時間': '4小時',
            '續航時間': '9小時'
          },
          image: '/images/products/carrybot/carrybot.jpg',
          gallery: [
            '/images/products/carrybot/carry1.png',
            '/images/products/carrybot/carry2.png',
            '/images/products/carrybot/carry3.png',
            '/images/products/carrybot/carry5.png'
          ]
        },
        8: {
          id: 8,
          name: 'CleanMart',
          category: '清潔機器人',
          description: '專為小型綜合商場環境量身定制的智能清潔機器人，集清潔與商品促銷雙重功能於一體。採用先進的自主導航技術，自動規劃清掃路徑，時尚外觀設計配備陳列區和廣告屏，為您的商業空間帶來全新的清潔體驗。',
          features: ['智能導航系統', '一體化清潔系統', '智能控制與管理', '商業促銷功能', '智能充電系統', '掃吸拖一體化'],
          specifications: {
            '外形尺寸': '390mm × 390mm × 1080mm',
            '機體重量': '23kg ± 1kg',
            '螢幕尺寸': '廣告平板：10.1寸（機器供電）',
            '通過寬度': '500mm（過縫寬度：≥20mm）',
            '爬坡能力': '不帶貨架版本：≤10° / 帶貨架版本：≤5°',
            '巡航速度': '≤0.3m/s',
            '定位精準度': '釐米級',
            '越障能力': '不帶貨架版本：≥20mm / 帶貨架版本：≥10mm',
            '電池類型': '磷酸鐵鋰',
            '電池容量': '19.2V，15Ah',
            '電池壽命': '充放電2000次以上',
            '充電時間': '240分鐘（4小時）',
            '續航時間': '清潔續航：180-300分鐘 / 待機續航：1天',
            '清水箱容量': '4.8L',
            '污水箱容量': '4.8L',
            '塵盒容量': '1L',
            '最大清掃面積': '1000㎡（建築面積）',
            '單次清掃面積': '500㎡（實際面積）',
            '清潔覆蓋率': '90%',
            '工作雜訊': '標準模式≤65dB，強勁模式≤75dB',
            '防護等級': 'IP24',
            '工作溫度': '0℃-40℃'
          },
          image: '/images/products/cleanMart/j30-main.jpg',
          gallery: [
            '/images/products/cleanMart/j30-main2.jpg',
            '/images/products/cleanMart/j30-2.jpg'
          ]
        },
        9: {
          id: 9,
          name: 'OrionStar CleaniBot AI',
          category: '清潔機器人',
          description: 'OrionStar CleaniBot AI 清潔機器人採用先進的 AI 技術，提供全自動化清潔解決方案。搭載 InstantClean 地面護理解決方案，可同時進行掃地、刷洗、吸塵、拖地、自清潔、消毒等多種功能，為您的商業空間帶來革命性的清潔體驗。',
          features: ['全自動化操作', '多功能一體式清潔', '超靜音運作', '優異清潔效能', '智慧導航系統', '消毒系統'],
          specifications: {
            '清潔寬度': '520mm',
            '最小通道寬度': '700mm',
            '最大爬坡角度': '6°',
            '重量': '70公斤',
            '尺寸': '650×580×550mm',
            '螢幕': '10.1吋',
            '清水箱容量': '22公升',
            '廢水箱容量': '15公升',
            '充電時間': '<4小時',
            '地圖建構能力': '最大10,000m²',
            '工作雜訊': '55分貝@1公尺',
            '水回收率': '97%'
          },
          image: '/images/products/cleaning-robot/cleaning-robot-main.jpg',
          gallery: [
            '/images/products/cleaning-robot/cleaning-robot-main2.jpg'
          ]
        }
      };

      const product = productsData[id];
      
      if (!product) {
        return res.status(404).render('errors/404', {
          title: '產品不存在',
          message: '您要查找的產品不存在。'
        });
      }

      res.render('products/detail', {
        title: `${product.name} - 產品詳情`,
        page: 'products',
        product
      });
    } catch (error) {
      console.error('產品詳情頁面錯誤:', error);
      res.status(500).render('errors/500', {
        title: '伺服器錯誤',
        message: '載入產品詳情頁面時發生錯誤'
      });
    }
  }

  // 產品分類頁面
  static async category(req, res) {
    try {
      const { category } = req.params;
      
      // 根據分類獲取產品列表
      const categoryMap = {
        'delivery': '遞送服務型機器人',
        'greeting': '接待服務型機器人',
        'industrial': '工業配送型機器人',
        'cleaning': '清潔機器人'
      };

      const categoryName = categoryMap[category];
      if (!categoryName) {
        return res.status(404).render('errors/404', {
          title: '分類不存在',
          message: '您要查找的產品分類不存在。'
        });
      }

      res.render('products/category', {
        title: `${categoryName} - 產品中心`,
        page: 'products',
        category: categoryName,
        categoryKey: category
      });
    } catch (error) {
      console.error('產品分類頁面錯誤:', error);
      res.status(500).render('errors/500', {
        title: '伺服器錯誤',
        message: '載入產品分類頁面時發生錯誤'
      });
    }
  }
}

module.exports = ProductsController;
