const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

const plugins = [

  // [
  //   "import",
  //   {
  //     "libraryName": "vxe-table",
  //     "style": true // 样式是否也按需加载
  //   }
  // ]
]
if (IS_PROD) {
  plugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins
}
