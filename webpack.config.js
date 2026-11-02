const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const baseConfig = {
    entry: path.resolve(__dirname, './src/index'),
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, './dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            filename: 'index.html',
        }),
        new CleanWebpackPlugin(),
    ],
};

// Each env config supplies its own API credentials strategy:
// dev/prod read .env via dotenv-webpack, gh builds a static demo from local mocks.
const envConfigFiles = {
    dev: './webpack.dev.config',
    prod: './webpack.prod.config',
    gh: './webpack.gh.config',
};

module.exports = ({ mode }) => {
    const configPath = envConfigFiles[mode] ?? envConfigFiles.dev;
    const envConfig = require(configPath);

    return merge(baseConfig, envConfig);
};
