const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].[contenthash:8].js",
    chunkFilename: "js/[name].[contenthash:8].chunk.js",
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "点位检查",
      filename: "index.html",
      favicon: "./src/favico.svg",
      template: "./src/template.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "static/img/[hash:8][ext][query]",
        },
      },
    ],
  },
};