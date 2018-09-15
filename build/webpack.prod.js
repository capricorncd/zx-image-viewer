/**
 * Created by capricorncd 5/10/2018
 * https://github.com/capricorncd
 */
const merge = require('webpack-merge')
const webpack = require('webpack')
const baseConfig = require('./webpack.base')
const banner = require('./banner')

module.exports = merge(baseConfig, {
  mode: 'production',
  output: {
    filename: 'js/[name].min.js'
  },
  plugins: [
    new webpack.BannerPlugin(banner)
  ]
})
