const path = require('path');
const { paths } = require('./common');
const os = require('os');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AutoDllPlugin = require('autodll-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const rootPath = paths.ROOT_PATH;
const sourcePath = paths.SRC_PATH;
const entryPath = paths.ENTRY_PATH;
const templatesPath = paths.TEMPLATES_PATH;
const buildPath = paths.BUILD_PATH;
const assetsPath = paths.ASSETS_PATH;
const componentsPath = paths.COMPONENTS_PATH;

const cpus = os.cpus().length;
const threadOptions = {
  workers: cpus,
  workerParallelJobs: 50,
  workerNodeArgs: ['--max-old-space-size=1024'],
  poolRespawn: false,
  poolTimeout: 2000,
  poolParallelJobs: 50,
  name: 'my-pool'
};

module.exports = {
  entry: path.resolve(entryPath, 'index.jsx'),
  output: {
    publicPath: '',
    path: buildPath,
    filename: '[hash].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader',
            options: threadOptions
          },
          {
            loader: 'babel-loader',
            options: {
              // cacheDirectory: true
              presets: [
                "@babel/preset-env",
                "@babel/preset-react"
              ],
              plugins: [
                ["import", {
                  "libraryName": "antd",
                  "libraryDirectory": "es",
                  "style": true
                }],
                ["@babel/plugin-transform-runtime", {
                  "corejs": false,
                  "helpers": true,
                  "regenerator": true,
                  "useESModules": true
                }],
                ["@babel/plugin-proposal-decorators", {
                  "legacy": true
                }],
                ["@babel/plugin-proposal-class-properties", {
                  "loose": true
                }]
              ]
            }
          }
        ]
      },
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        enforce: 'pre'
      },
      // {
      //   test: /\.jsx$/,
      //   loader: 'eslint-loader',
      //   enforce: "pre",
      //   include: [sourcePath], // 指定检查的目录
      //   // options: { // 这里的配置项参数将会被传递到 eslint 的 CLIEngine 
      //   //     formatter: require('eslint-friendly-formatter') // 指定错误报告的格式规范
      //   // }
      // },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it uses publicPath in webpackOptions.output
              // publicPath: '',
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: {
                localIdentName: '[path][name]__[local]'
              }
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it uses publicPath in webpackOptions.output
              // publicPath: '',
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: {
                localIdentName: '[path][name]__[local]'
              }
            }
          },
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.less$/,
        include: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it uses publicPath in webpackOptions.output
              // publicPath: '',
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            },
          },
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true
            }
          }
        ]
      },
      {
        test: /\.(icon|eot|svg|ttf|TTF|woff|woff2|png|jpe?g|gif)(\?\S*)$/,
        loader: 'file-loader',
        query: {
          name: '[name].[ext]?[hash]'
        },
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    //表示这几种文件的后缀名可以省略，按照从前到后的方式来进行补全
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      src: sourcePath,
      components: componentsPath
    }
  },
  plugins: [
    // 将js, css文件引入html中a
    new HtmlWebpackPlugin({
      title: 'Application',
      filename: 'index.html',
      template: path.resolve(templatesPath, 'index.html'),
      inject: 'body',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].css', // 非入口(non-entry) chunk 文件的名称，可以理解为通过异步加载（分块打包）打包出来的文件名称
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
    new webpack.ContextReplacementPlugin(
      /moment[/\\]locale$/,
      /zh-cn/,
    ),
    new AutoDllPlugin({
      inject: true, // will inject the DLL bundles to index.html
      filename: '[name].js',
      entry: {
        vendor: [
          'react',
          'react-dom'
        ]
      }
    }),
    new CopyWebpackPlugin([
      {
        context: sourcePath,
        from: `${assetsPath}/**/*`,
        to: buildPath
      },
    ])
  ]
};