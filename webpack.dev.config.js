const path = require('path');
const webpack = require('webpack');
const { config: loadEnv } = require('dotenv');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const { apiDefines } = require('./webpack.api-env');

const apiKey = loadEnv().parsed?.API_KEY ?? '';

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: path.resolve(__dirname, './dist'),
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [{ from: 'mocks/*.json', to: 'mocks/[name]' }],
        }),
        new webpack.DefinePlugin(apiDefines({ apiKey })),
    ],
};
