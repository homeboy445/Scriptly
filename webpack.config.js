const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { merge } = require("webpack-merge");

const buildMode = process.env.BUILD_MODE || "development";

console.log("Building for:", process.env.BUILD_MODE);

const baseConfig = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      }
    ],
  },
  mode: buildMode,
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'scriptOrch'
  },
  plugins: [
    new CleanWebpackPlugin(),
  ]
};

if (buildMode === "development") {
  baseConfig.plugins.push(new HtmlWebpackPlugin({
    template: './public/index.html',
  }));
  baseConfig.devServer = {
    static: './dist',
  };
}

const commonJsExportConfig = merge(baseConfig, {
  output: { filename: "index.cjs", libraryTarget: "commonjs2" },
});

module.exports = [baseConfig, commonJsExportConfig];
