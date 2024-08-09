import CopyPlugin from "copy-webpack-plugin";
import dotenv from "dotenv";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MomentLocalesPlugin from "moment-locales-webpack-plugin";
import { resolve } from "path";
import { Configuration, container, DefinePlugin } from "webpack";
import federationConfig from "../../federation.config.json";
import pkg, { dependencies } from "../../package.json";

dotenv.config();

const envLoadScript = `(() => {
    function waitForWindowValue (prop) {
        return new Promise((resolve) => {
            if (window[prop]) {
                return resolve(window[prop]);
            }
            let value;
            Object.defineProperty(window, prop, {
                get: () => value,
                set: (newValue) => {
                    resolve(value = newValue);
                },
            });
        });
    }

    const origin = new URL(document.currentScript && document.currentScript.src).origin;
    const url = origin + "/assets/_env.js";
    const scriptElement = document.createElement("script");
    const valuePromise = waitForWindowValue(".petasosEnv");

    scriptElement.src = url;
    document.head.append(scriptElement);
    valuePromise.finally(() => scriptElement.remove());

    return valuePromise;
})();`;

const findEnvModule = ({ request }, callback) => {
    if (/\/_env$/.test(request)) {
        return callback(null, `promise ${envLoadScript}`);
    }
    callback(undefined, undefined);
};

export const commonConfig: Configuration = {
    resolve: {
        extensions: [".jsx", ".js", ".tsx", ".ts"],
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
                exclude: /node_modules/,
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
                test: /\.css$/,
                include: /node_modules/,
                use: [{ loader: "style-loader" }, { loader: "css-loader" }],
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
    entry: {
        main: "./src/index.ts",
    },
    plugins: [
        new MomentLocalesPlugin({
            localesToKeep: ["en"],
        }),
        new ForkTsCheckerWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: `${pkg.name} ${pkg.version}`,
            publicPath: "/",
            chunks: ["runtime", "main"],
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: "src/assets",
                    to: "assets",
                    noErrorOnMissing: true,
                },
                {
                    from: "_env.js",
                    to: "assets",
                    noErrorOnMissing: true,
                },
            ],
        }),
        new DefinePlugin({
            _VERSION_: JSON.stringify(`${pkg.name} v${pkg.version}`),
        }),
        new container.ModuleFederationPlugin({
            filename: "remoteEntry.js",
            shared: {
                ...dependencies,
                "@emotion/react": {
                    singleton: true,
                    requiredVersion: dependencies["@emotion/react"],
                },
                "@mui/material": {
                    singleton: true,
                    requiredVersion: dependencies["@mui/material"],
                },
                react: {
                    singleton: true,
                    requiredVersion: dependencies["react"],
                },
                "react-dom": {
                    singleton: true,
                    requiredVersion: dependencies["react-dom"],
                },
                "react-router-dom": {
                    singleton: true,
                },
            },
            ...federationConfig,
        }),
    ],
    performance: {
        hints: false,
    },
    optimization: {
        runtimeChunk: false,
    },
};
