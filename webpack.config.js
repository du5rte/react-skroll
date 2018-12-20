var path = require('path')
var webpack = require('webpack')

var env = process.env.NODE_ENV

var config = {
  output: {
    library: 'ReactSkroll',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' }
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      'react-native$': 'react-native-web'
    }
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
}

if (process.env.NODE_ENV === 'production') {
  config.mode = 'production'

  config.externals = {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'prop-types': 'PropTypes',
  }

  if (process.env.TARGET === 'minify') {
    config.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        mangle: {
          except: ['React', 'ReactDOM', 'ReactSkroll', 'PropTypes', 'createResizeDetector']
        }
      })
    )
  }
}

module.exports = config
