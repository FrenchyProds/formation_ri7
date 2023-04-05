const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = "style-loader";

const config = {
  entry: {main: path.resolve(__dirname, "src/index.js"), poi: path.resolve(__dirname, "src/poi.js")},
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    clean: true,
    publicPath:'/'
  },
  devServer: {
    historyApiFallback: true,
    open: true,
    hot: true,
    host: "localhost",
    watchFiles: [path.resolve(__dirname, 'src')],
  },
  optimization: {
    sideEffects: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      // chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      filename: 'poi.html',
      template: './src/poi.html',
      // chunks: ['poi']
  })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: "babel-loader",
        options: {
          presets: [
            ['@babel/preset-env', { targets: "defaults" }]
          ],
          plugins: ['@babel/plugin-proposal-class-properties']
        }
      },
      {
        test: /\.s[ac]ss$/i,
        sideEffects: true,
        use: [stylesHandler, "css-loader", "sass-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
    ],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
