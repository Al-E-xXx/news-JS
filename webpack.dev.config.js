const path = require('path');
const DotenvWebpackPlugin = require('dotenv-webpack');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: path.resolve(__dirname, './dist'),
    },
    plugins: [new DotenvWebpackPlugin()],
};
