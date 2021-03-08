import { resolve } from 'path';
import merge from 'webpack-merge';
import { commonConfig } from './common';

export const prodConfig = merge(commonConfig, {
    mode: 'production',
    output: {
        filename: 'js/bundle.min.js',
        path: resolve(__dirname, '../../dist'),
    },
    devtool: 'source-map',
});

export default prodConfig;
