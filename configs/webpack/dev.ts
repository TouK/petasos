import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import {CustomizeRule, mergeWithRules} from "webpack-merge";
import {commonConfig} from "./common";

export const devConfig = mergeWithRules({
    module: {
        rules: {
            test: CustomizeRule.Match,
            use: {
                loader: CustomizeRule.Match,
                options: CustomizeRule.Replace
            }
        }
    }
})(commonConfig, {
    mode: "development",
    devServer: {
        host: "0.0.0.0",
        port: 7890,
        hot: true, // enable HMR on the server
        historyApiFallback: true,
        proxy: {
            "/apps-proxy": {
                target: process.env.HERMES_MANAGEMENT_DEFAULT,
                pathRewrite: {"^/apps-proxy": ""},
                changeOrigin: true
            }
        }
    },
    devtool: "eval-cheap-module-source-map",
    optimization: {
        moduleIds: "named"
    },
    plugins: [
        new ReactRefreshWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            plugins: [
                                require.resolve("react-refresh/babel")
                            ]
                        }
                    }
                ]
            }
        ]
    }
});

export default devConfig;
