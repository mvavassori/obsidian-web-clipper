const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

module.exports = (env) => {
  const browser = env.browser || "chromium"; // Default to chromium if not specified

  return {
    entry: {
      popup: `./src/${browser}/index.js`,
      options: `./src/${browser}/options.js`,
      background: `./src/${browser}/background.js`,
    },
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, `dist-${browser}`),
    },
    mode: "development",
    devtool: "inline-source-map",
    module: {
      rules: [
        {
          test: /\.js|jsx$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                ["@babel/preset-react", { runtime: "automatic" }],
              ],
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [tailwindcss, autoprefixer],
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        filename: "popup.html",
        chunks: ["popup"],
      }),
      new HtmlWebpackPlugin({
        template: "./public/options.html",
        filename: "options.html",
        chunks: ["options"],
      }),
      new MiniCssExtractPlugin(),
      new CopyPlugin({
        patterns: [
          { from: "public", to: ".", globOptions: { ignore: ["**/*.html"] } },
          { from: `manifests/manifest_${browser}.json`, to: "manifest.json" }, // Copy the appropriate manifest
        ],
      }),
    ],
    devServer: {
      contentBase: path.join(__dirname, "dist"),
      compress: true,
      port: 9000,
    },
  };
};
