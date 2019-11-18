const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const baseConfig = require('./webpack.config')
const { buildPath } = require('./path')

baseConfig.plugins.push(
  new BundleAnalyzerPlugin({
    analyzerMode: 'static'
  })
)
module.exports = {
  ...baseConfig,
  mode: 'production',
  output: {
    path: buildPath,
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js'
  }
}
