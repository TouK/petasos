import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import { CustomizeRule, mergeWithRules } from "webpack-merge";
import { commonConfig } from "./common";

export const devConfig = mergeWithRules({
    module: {
        rules: {
            test: CustomizeRule.Match,
            use: {
                loader: CustomizeRule.Match,
                options: CustomizeRule.Replace,
            },
        },
    },
})(commonConfig, {
    mode: "development",
    devServer: {
        client: {
            overlay: false,
        },
        host: "0.0.0.0",
        port: 7890,
        hot: true,
        allowedHosts: "all",
        historyApiFallback: {
            disableDotRule: true,
        },
        proxy: {
            "/apps-proxy": {
                target: process.env.HERMES_MANAGEMENT_DEFAULT,
                pathRewrite: { "^/apps-proxy": "" },
                changeOrigin: true,
                headers: {
                    "Access-Control-Allow-Origin": "http://localhost:3000, http://localhost:7890",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTION",
                    "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
                },
                onProxyReq: function (request) {
                    request.setHeader("Origin", process.env.HERMES_MANAGEMENT_DEFAULT);
                },
                onProxyRes: function (proxyRes, req, res) {
                    proxyRes.headers["Access-Control-Allow-Origin"] = "*";
                },
            },
        },
    },
    devtool: "eval-source-map",
    plugins: [
        new ReactRefreshWebpackPlugin({
            overlay: false,
        }),
    ],
});

export default devConfig;
