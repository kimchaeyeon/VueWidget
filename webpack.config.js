const path = require('path')
const merge = require('webpack-merge')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // es6 문법이라 {} 안에 넣어야함

require('@babel/polyfill')

module.exports = (env, opts) => { // opts 개발용 제품용 구분
  const config = { // 중복되는 옵션들
    resolve: { // 생락하고 싶은 확장자 명시
      extensions: ['.vue', '.js']
    },
    entry: { // 진입점
      app: [
        '@babel/polyfill',
        path.join(__dirname, 'main.js') // __dirname: 현재파일의 경로를 알려주는 node의 전역변수 __dirname+main.js
      ]
    },
    output: { // 결과물에 대한 설정
      filename: '[name].js', // app.js
      path: path.join(__dirname, 'dist')
    },
    module: {// webpack의 처리과정을 module에 명시
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            'css-loader',
            'postcss-loader'
          ]
        },
        {
          test: /\.scss$/,
          use: [
            'vue-style-loader',
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        }
      ]
    },
    plugins: [ // module이 처리되고 나서 추가적인 처리
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.html')
      }),
      // assets 디렉터리의 내용을 dist 디렉터리에 복사
      new CopyPlugin([
        {
          from: 'assets/',
          to: ''
        }
      ])
    ]
  }

  if (opts.mode === 'development') { // 개발용
    return merge(config, {
      // 추가 개발용 옵션
      devtool: 'eval', // webpack이 돌아갈 때 빌드시간을 축소하고 디버깅이 가능한 방식으로 동작하도록 함, 다만 파일의 용량이 커질 수 있음, 개발용으로 적합
      devServer: {
        open: false,
        hot: true
      }
    })
  } else { // 제품용 'production'
    return merge(config, {
      // 추가 제품용 옵션
      devtool: 'cheap-module-source-map', // 빌드시간이 길고 디버깅이 안되지만, 용량이 적고 최적화가 잘되어있는 모드
      plugins: [
        new CleanWebpackPlugin() // output에 해당하는 경로에 해당하는(dist) 빌드를 할때마다 삭제하고 시작하겠다는 뜻
      ]
    })
  }
}
