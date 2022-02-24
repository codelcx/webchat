module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'assets': '@/assets',
        'common':'@/components/common',
        'content':'@/components/content',
        'views': '@/views',
      },
    }
  }
}