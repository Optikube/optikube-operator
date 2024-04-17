const path = require("path");
const Dotenv = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {
  ReactRefreshWebpackPlugin,
} = require("@pmmmwh/react-refresh-webpack-plugin");

const isDevelopment = process.env.NODE_ENV;

module.exports = {
  entry: path.resolve(__dirname, "./front-end/index.js"),
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "bundle.js",
  },
  mode: isDevelopment ? "development" : "production",
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
        test: /\.s?css$/,
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.(jpg|jpeg|png|ttf|svg|gif)$/,
        type: "asset/resource",
        exclude: /node_modules/,
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ["ts-loader"],
      },
    ],
  },
  devServer: {
    static: {
      // directory: path.join(__dirname, "/build"),
      directory: path.join(__dirname, "./build"),
      publicPath: "/",
    },
    hot: true,
    historyApiFallback: true,
    compress: true,
    port: 3005,
    proxy: {
      "/": {
        target: "http://localhost:8080",
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "optikoob",
      template: "index.html",
    })
  ],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".gif", ".png", ".svg"],
    alias: {
      "next/link": path.resolve(__dirname, "node_modules/next/link"),
      "@": path.resolve(__dirname, "public/utils/aceUI"),
    },
  },
};
