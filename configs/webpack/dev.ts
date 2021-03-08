import merge from 'webpack-merge';
import { commonConfig } from './common';

export const devConfig = merge(commonConfig, {
    mode: 'development',
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
    optimization: {
        namedModules: true,
    },
});

export default devConfig;
