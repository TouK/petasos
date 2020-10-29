import { HotModuleReplacementPlugin } from 'webpack';
import merge from 'webpack-merge';
import { commonConfig } from './common';

export const devConfig = merge(commonConfig, {
    mode: 'development',
    entry: [
        'react-hot-loader/patch', // activate HMR for React
        'webpack-dev-server/client?http://0.0.0.0:7890', // bundle the client for webpack-dev-server and connect to the provided endpoint
        'webpack/hot/only-dev-server', // bundle the client for hot reloading, only- means to only hot reload for successful updates
    ],
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom',
        },
    },
    devServer: {
        host: '0.0.0.0',
        port: 7890,
        hot: true, // enable HMR on the server
        historyApiFallback: true,
        proxy: {
            '/apps-proxy': {
                target: process.env.HERMES_MANAGEMENT_DEFAULT,
                pathRewrite: { '^/apps-proxy': '' },
                changeOrigin: true,
            },
        },
    },
    devtool: 'cheap-module-eval-source-map',
    plugins: [
        new HotModuleReplacementPlugin(), // enable HMR globally
    ],
    optimization: {
        namedModules: true,
    },
});

export default devConfig;
