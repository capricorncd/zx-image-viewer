/**
 * Created by zx1984 5/10/2018
 * https://github.com/zx1984
 */
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')

module.exports = merge(baseConfig, {
  mode: 'production',
  output: {
    filename: 'js/[name].min.js'
  },
  plugins: []
})
