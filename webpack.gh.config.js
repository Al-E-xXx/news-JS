const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Deployment build for GitHub Pages.
//
// NewsAPI rejects requests from non-localhost origins, and the course proxy
// (rss-news-api.onrender.com) is currently unreachable, so the deployed app
// reads static JSON responses that mirror the proxy's own /mocks/* endpoints.
// The API key is intentionally NOT embedded into the public bundle.
module.exports = {
    mode: 'production',
    output: {
        publicPath: '/news-JS/',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.API_URL': JSON.stringify('mocks/'),
            'process.env.API_KEY': JSON.stringify('mock'),
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    // The app requests "mocks/sources" / "mocks/everything" (no extension,
                    // like the course proxy's /mocks/* endpoints), so copy sources.json -> mocks/sources.
                    from: 'mocks/*.json',
                    to: 'mocks/[name]',
                },
            ],
        }),
    ],
};
