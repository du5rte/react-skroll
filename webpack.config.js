var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var env = process.env.NODE_ENV

var config = {
  output: {
    library: 'ReactSkroll',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' }
      },
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    })
  ]
}

if (process.env.NODE_ENV !== 'production') {
  config.mode = 'development'
  config.devtool = 'inline-source-map'

  config.plugins.push(
    new HtmlWebpackPlugin({
      template: 'demo/index.html'
    })
  )
}

if (process.env.NODE_ENV === 'production') {
  config.mode = 'production'

  config.externals = {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'react-spring': 'ReactSpring',
    'prop-types': 'PropTypes',
  }

  if (process.env.TARGET === 'minify') {
    config.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        mangle: {
          except: ['React', 'ReactDOM', 'ReactSpring', 'ReactSkroll', 'PropTypes', 'createResizeDetector']
        }
      })
    )
  }
}

module.exports = config
