const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require("webpack-merge");

const buildMode = process.env.BUILD_MODE ?? "development";

console.log("Building for:", buildMode);

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
  plugins: []
};

const finalBuildConfigList = [baseConfig];

if (buildMode === "development") {
  baseConfig.plugins.push(new HtmlWebpackPlugin({
    template: './public/index.html',
  }));
  baseConfig.devServer = {
    static: './dist',
  };
} else {
  const commonJsExportConfig = merge({ ...baseConfig }, {
    output: { filename: "index.cjs", libraryTarget: "commonjs2" },
  });
  finalBuildConfigList.push(commonJsExportConfig);
}

module.exports = finalBuildConfigList;
