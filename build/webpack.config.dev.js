const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const { HotModuleReplacementPlugin } = require('webpack')

const baseConfig = require('./webpack.config')
const merge = require('webpack-merge')
const { buildPath } = require('./path')

module.exports = merge(baseConfig, {
  mode: 'development',
  entry: {
    app: ['webpack-hot-middleware/client?path=__hmr', './src/index.tsx']
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [new FriendlyErrorsWebpackPlugin(), new HotModuleReplacementPlugin()],
  devServer: {
    contentBase: buildPath,
    quiet: true,
    open: false
  }
})
