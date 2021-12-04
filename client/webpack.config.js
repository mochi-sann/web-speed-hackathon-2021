const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const SRC_PATH = path.resolve(__dirname, './src');
const PUBLIC_PATH = path.resolve(__dirname, '../public');
const UPLOAD_PATH = path.resolve(__dirname, '../upload');
const DIST_PATH = path.resolve(__dirname, '../dist');

const MODE = process.env.NODE_ENV === 'development' ? 'development' : 'production';

/** @type {import('webpack').Configuration} */
const config = {
  devServer: {
    contentBase: [PUBLIC_PATH, UPLOAD_PATH],
    historyApiFallback: true,
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  devtool: 'source-map',
  entry: {
    main: [
      'core-js',
      'regenerator-runtime/runtime',
      'jquery-binarytransport',
      path.resolve(SRC_PATH, './index.css'),
      path.resolve(SRC_PATH, './buildinfo.js'),
      path.resolve(SRC_PATH, './index.jsx'),
    ],
  },
  mode: MODE,
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.jsx?$/,
        use: [{ loader: 'babel-loader' }],
      },
      {
        test: /\.css$/i,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader', options: { url: false } },
          { loader: 'postcss-loader' },
        ],
      },
      {
        test: /\.(jpe?g|png)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
          outputPath: path.resolve(__dirname, 'dist/img'),
        },
      },
    ],
  },
  output: {
    filename: 'scripts/[name].js',
    path: DIST_PATH,
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      AudioContext: ['standardized-audio-context', 'AudioContext'],
      Buffer: ['buffer', 'Buffer'],
      'window.jQuery': 'jquery',
    }),
    new webpack.EnvironmentPlugin({
      BUILD_DATE: new Date().toISOString(),
      // Heroku では SOURCE_VERSION 環境変数から commit hash を参照できます
      COMMIT_HASH: process.env.SOURCE_VERSION || '',
      NODE_ENV: MODE,
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
    }),
    new HtmlWebpackPlugin({
      inject: false,
      template: path.resolve(SRC_PATH, './index.html'),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '../public/images/',
          to: path.resolve(__dirname, '../public/images/dist'),
        },
      ],
    }),
    new ImageminWebpWebpackPlugin({
      config: [
        {
          test: /\.(jpe?g|png|gif)$/i,
          options: {
            quality: 60,
          },
        },
      ],
      detailedLogs: true,
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      fs: false,
      path: false,
    },
  },
};

module.exports = config;
