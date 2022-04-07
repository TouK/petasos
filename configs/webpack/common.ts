import AddAssetHtmlPlugin from "add-asset-html-webpack-plugin";
import dotenv from "dotenv";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { resolve } from "path";
import { Configuration } from "webpack";
import pkg from "../../package.json";

dotenv.config();

const findEnvModule = ({ request }, callback) => {
  if (/\/_env$/.test(request)) {
    return callback(null, "window['.env']");
  }
  callback(undefined, undefined);
};

export const commonConfig: Configuration = {
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
    symlinks: false,
  },
  context: resolve(__dirname, "../.."),
  target: "web",
  externals: [findEnvModule],
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [{ loader: "babel-loader" }],
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: {
                mode: "local",
                exportLocalsConvention: "dashes",
              },
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "img/[hash].[ext]",
            },
          },
          {
            loader: "image-webpack-loader",
            options: {
              bypassOnDebug: true,
              optipng: {
                optimizationLevel: 7,
              },
              gifsicle: {
                interlaced: false,
              },
            },
          },
        ],
      },
    ],
  },
  entry: ["./src/index.tsx"],
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: `${pkg.name} ${pkg.version}`,
      publicPath: "/",
    }),
    new AddAssetHtmlPlugin({
      filepath: resolve(__dirname, "../../_env.js"),
      publicPath: "/",
    }),
  ],
  performance: {
    hints: false,
  },
  optimization: {
    runtimeChunk: false,
    mergeDuplicateChunks: true,
    concatenateModules: true,
  },
};
