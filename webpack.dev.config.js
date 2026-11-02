const path = require('path');
const webpack = require('webpack');
const DotenvWebpackPlugin = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: path.resolve(__dirname, './dist'),
    },
    plugins: [
        new DotenvWebpackPlugin(),
        // serve mocks on dev server too, so demo mode works locally as well
        new CopyWebpackPlugin({
            patterns: [{ from: 'mocks/*.json', to: 'mocks/[name]' }],
        }),
        new webpack.DefinePlugin({
            'process.env.API_MOCK_URL': JSON.stringify('mocks/'),
            'process.env.API_LIVE_AVAILABLE': JSON.stringify('true'),
        }),
    ],
};
