export default defineAppConfig({
  lazyCodeLoading: 'requiredComponents',
  pages: [
    'pages/today/index',
    'pages/daily/index',
    'pages/favorites/index',
    'pages/me/index',
    'pages/news-detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    backgroundColor: '#FFF8EC',
    navigationBarBackgroundColor: '#FFF8EC',
    navigationBarTitleText: 'AI 小报',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#8A7C6F',
    selectedColor: '#16A085',
    backgroundColor: '#FFFDF7',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/today/index',
        text: '今日',
        iconPath: './tabbar/today.png',
        selectedIconPath: './tabbar/today-active.png'
      },
      {
        pagePath: 'pages/daily/index',
        text: '日报',
        iconPath: './tabbar/daily.png',
        selectedIconPath: './tabbar/daily-active.png'
      },
      {
        pagePath: 'pages/favorites/index',
        text: '收藏',
        iconPath: './tabbar/favorites.png',
        selectedIconPath: './tabbar/favorites-active.png'
      },
      {
        pagePath: 'pages/me/index',
        text: '我的',
        iconPath: './tabbar/me.png',
        selectedIconPath: './tabbar/me-active.png'
      }
    ]
  }
})
