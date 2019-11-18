const os = require('os')
const path = require('path')

const HappyPack = require('happypack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const postcssPresetEnv = require('postcss-preset-env')
const WebpackBar = require('webpackbar')
const { DefinePlugin } = require('webpack')

const { buildPath, templatePath, faviconPath, node_modules, src } = require('./path')

const postCSSLoaderConfig = {
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    plugins: () => [
      postcssPresetEnv({
        browsers: ['> 1%', 'last 2 versions', 'not ie <= 8']
      })
    ]
  }
}

module.exports = {
  entry: {
    app: './src/index.tsx'
  },
  resolve: {
    extensions: ['.esm.js', '.js', '.ts', '.tsx', '.json'],
    alias: {
      '@components': path.resolve(src, 'components'),
      '@store': path.resolve(src, 'store')
    }
  },
  output: {
    path: buildPath,
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['happypack/loader?id=tsx'],
        exclude: node_modules
      },
      {
        test: /\.less$/,
        include: src,
        use: [
          {
            loader: 'style-loader',
            options: {
              // RHL 的使用会导致在添加 selector 时 hmr 失败。关闭 hmr，交给 RHL 处理可以解决问题
              // ref:https://github.com/webpack-contrib/style-loader/issues/320
              hmr: false
            }
          },
          {
            loader: 'css-loader',
            options: {
              modules: 'local',
              importLoaders: 2, // 为了支持 CSS Modules，因为 css 里可能会使用 import
              localIdentName: '[name]-[local]__[hash:base64:5]',
              camelCase: 'dashes'
            }
          },
          postCSSLoaderConfig,
          'less-loader'
        ]
      },
      {
        test: /\.css$/,
        include: [...['react-toastify', 'normalize'].map(module => path.join(node_modules, module)), src],
        use: ['style-loader', 'css-loader', postCSSLoaderConfig]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HappyPack({
      id: 'tsx',
      loaders: [
        {
          loader: 'ts-loader',
          options: { transpileOnly: true, happyPackMode: true }
        },
        { loader: 'babel-loader' }
      ]
    }),
    new HtmlWebpackPlugin({
      title: 'react-scaffold',
      inject: true,
      template: templatePath,
      favicon: faviconPath
    }),
    new WebpackBar({
      color: '#A06EE1'
    })
  ],
  optimization: {
    runtimeChunk: {
      name: 'boostrap'
    },
    splitChunks: {
      cacheGroups: {
        vendors: false,
        default: false,
        vendor: {
          chunks: 'all',
          name: 'vendor',
          test: /node_modules/
        }
      }
    }
  }
}
