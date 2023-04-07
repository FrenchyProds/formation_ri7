const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = "style-loader";

const config = {
  entry: {
    main: path.resolve(__dirname, "src/index.js"),
    poi: path.resolve(__dirname, "src/poi.js"),
    geoloc: path.resolve(__dirname, "src/geoloc.js")
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
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
    // new HtmlWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/index.html'),
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      filename: 'poi.html',
      template: path.resolve(__dirname, 'src/poi.html'),
      chunks: ['poi']
    }),
    new HtmlWebpackPlugin({
      filename: 'geoloc.html',
      template: path.resolve(__dirname, 'src/geoloc.html'),
      chunks: ['geoloc']
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        exclude: "/node_modules",
        use: ['babel-loader'],
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
