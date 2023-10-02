import { resolve } from "path";
import merge from "webpack-merge";
import ZipPlugin from "zip-webpack-plugin";
import { commonConfig } from "./common";

export const prodConfig = merge(commonConfig, {
    mode: "production",
    output: {
        filename: "js/[name]_[contenthash].min.js",
        path: resolve(__dirname, "../../dist"),
    },
    devtool: "source-map",
    plugins: [new ZipPlugin({ filename: "petasos.zip" })],
});

export default prodConfig;
