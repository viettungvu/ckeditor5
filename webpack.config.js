"use strict";
const CKEditorWebpackPlugin = require("@ckeditor/ckeditor5-dev-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");
const { styles } = require("@ckeditor/ckeditor5-dev-utils");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  mode: "production",
  entry: {
    xClassicEditor: "./src/app.js",
  },
  plugins: [
    // new CKEditorWebpackPlugin({
    //   // The main language that will be built into the main bundle.
    //   language: "vi",
    //   addMainLanguageTranslationsToAllAssets: true,
    //   // Additional languages that will be emitted to the `outputDirectory`.
    //   // This option can be set to an array of language codes or `'all'` to build all found languages.
    //   // The bundle is optimized for one language when this option is omitted.
    //   //additionalLanguages: 'all',

    //   // For more advanced options see https://github.com/ckeditor/ckeditor5-dev/tree/master/packages/ckeditor5-dev-webpack-plugin.
    // }),
    new MiniCssExtractPlugin({
      filename: "xckeditor.min.css", // tên file css output
    }),
  ],
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].min.js",
    library: "XClassicEditor",
    libraryTarget: "umd",
    libraryExport: "default",
    clean: true, // tự xóa file cũ trước khi build mới (Webpack 5)
  },
  module: {
    rules: [
      // {
      //   test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
      //   use: [
      //     MiniCssExtractPlugin.loader,
      //     "css-loader",
      //     {
      //       loader: "postcss-loader",
      //       options: {
      //         postcssOptions: {
      //           plugins: [require("postcss-import"), require("postcss-nested")],
      //         },
      //       },
      //     },
      //   ],
      // },
      // {
      //   test: /\.(sa|sc|c)ss$/,
      //   use: [
      //     MiniCssExtractPlugin.loader,
      //     'css-loader'
      //   ]
      // },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          // {

          //   options: {
          //     injectType: "singletonStyleTag",
          //     attributes: {
          //       "data-cke": true,
          //     },
          //   },
          // },
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
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: "styles",
          test: /\.css$/,
          chunks: "all",
          enforce: true,
        },
      },
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // bỏ console.log
            passes: 2, // compress nhiều lần
          },
          output: {
            comments: false, // xóa comment
          },
        },
        extractComments: false,
      }),
    ],
  },
  // Useful for debugging.
  devtool: "source-map",

  // By default webpack logs warnings if the bundle is bigger than 200kb.
  performance: { hints: false },
};
