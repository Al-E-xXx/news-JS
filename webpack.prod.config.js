const webpack = require('webpack');
const DotenvWebpackPlugin = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    plugins: [
        new DotenvWebpackPlugin(),
        // bundle demo data so the app can run without a live api anywhere
        new CopyWebpackPlugin({
            patterns: [{ from: 'mocks/*.json', to: 'mocks/[name]' }],
        }),
        new webpack.DefinePlugin({
            'process.env.API_MOCK_URL': JSON.stringify('mocks/'),
            'process.env.API_LIVE_AVAILABLE': JSON.stringify('true'),
        }),
    ],
};
