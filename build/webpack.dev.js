/**
 * Created by zx1984 5/10/2018
 * https://github.com/zx1984
 */
'use strict';
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')

module.exports = merge(baseConfig, {
  mode: 'development',
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    host: '0.0.0.0',
    port: 9000,
    overlay: {
      errors: true
    },
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
    // new webpack.NoEmitOnErrorsPlugin()
  ]
})
