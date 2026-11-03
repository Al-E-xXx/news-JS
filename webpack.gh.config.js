const webpack = require('webpack');
const { config: loadEnv } = require('dotenv');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const { apiDefines } = require('./webpack.api-env');

const apiKey = loadEnv().parsed?.API_KEY ?? '';

module.exports = {
    mode: 'production',
    output: {
        publicPath: '/news-JS/',
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [{ from: 'mocks/*.json', to: 'mocks/[name]' }],
        }),
        new webpack.DefinePlugin(apiDefines({ apiKey, maskApiKey: true })),
    ],
};
