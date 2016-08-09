var path = require('path')
var webpack = require('webpack')

var env = process.env.NODE_ENV

var config = {
  output: {
    library: 'Scroll',
    libraryTarget: 'umd',
  },
  module: {
    loaders: [
      {test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel'},
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
  ]
}

if (process.env.NODE_ENV === 'production') {
  config.externals = {
    'react': 'React',
    'react-dom': 'ReactDOM',
  }

  if (process.env.TARGET === 'minify') {
    config.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        mangle: {
          except: ['React', 'ReactDOM', 'Scroll', 'createResizeDetector']
        }
      })
    )
  }
}

module.exports = config
