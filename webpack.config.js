const path = require("path");
const Dotenv = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  // entry: path.join(__dirname, "front-end/src", "index.js"),
  entry: path.resolve(__dirname, "front-end/src/index.js"),
  output: {
    path: path.resolve(__dirname, "front-end","build"),
  },
  mode: process.env.NODE_ENV,
  cache: false,
  module: {
    rules: [
      {
        test: /\.(?:js|jsx|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env", { targets: "defaults" }],
              "@babel/preset-react",
            ],
          },
        },
      },
      {
        test: /\.(css|scss)$/i,
        use: ["sass-loader", "postcss-loader",  "css-loader", "style-loader"],
      },
      {
        test: /\.(png|jpe?g|JPG)$/,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "front-end", "index.html"),
    }),
    isDevelopment && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
  devServer: {
    static: {
      // directory: path.join(__dirname, "/build"), 
      directory: path.join(__dirname, "front-end", "/build"),
      publicPath: "/",
    },
    hot: true,
    historyApiFallback: true,
    compress: true,
    port: 3005,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
      },
    },
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
};
