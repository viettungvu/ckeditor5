"use strict";
const CKEditorWebpackPlugin = require("@ckeditor/ckeditor5-dev-webpack-plugin");
const path = require("path");
const { styles } = require("@ckeditor/ckeditor5-dev-utils");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const isProduction = process.env.NODE_ENV == "production";
const config = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            comments: false,
          },
        },
      }),
    ],
  },
  entry: {
    "xClassicEditor.min": "./src/xClassicEditor.js",
  },
  plugins: [
    new CKEditorWebpackPlugin({
      // The main language that will be built into the main bundle.
      language: "vi",
      //addMainLanguageTranslationsToAllAssets: true
      // Additional languages that will be emitted to the `outputDirectory`.
      // This option can be set to an array of language codes or `'all'` to build all found languages.
      // The bundle is optimized for one language when this option is omitted.
      //additionalLanguages: 'all',

      // For more advanced options see https://github.com/ckeditor/ckeditor5-dev/tree/master/packages/ckeditor5-dev-webpack-plugin.
    }),
    new MiniCssExtractPlugin(),
  ],
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js",
    library: {
      name: "XClassicEditor",
      type: "umd",
      export: "default",
    },
    globalObject: "this",
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: "style-loader",
            options: {
              injectType: "singletonStyleTag",
              attributes: {
                "data-cke": true,
              },
            },
          },
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: styles.getPostCssConfig({
                themeImporter: {
                  themePath: require.resolve("@ckeditor/ckeditor5-theme-lark"),
                },
                minify: true,
              }),
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: ["raw-loader"],
      },
    ],
  },
  // Useful for debugging.
  // devtool: 'source-map',

  // By default webpack logs warnings if the bundle is bigger than 200kb.
  performance: { hints: false },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";

    // config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
  } else {
    config.mode = "development";
  }
  return config;
};
