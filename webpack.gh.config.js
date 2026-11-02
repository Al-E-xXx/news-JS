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
            // demo data is always available; mocks/ files are served without
            // extension, exactly like the loader requests
            'process.env.API_MOCK_URL': JSON.stringify('mocks/'),
            'process.env.API_URL': JSON.stringify(process.env.API_URL ?? 'https://newsapi.org/v2/'),
            // live api is disabled at build time in this mode
            'process.env.API_LIVE_AVAILABLE': JSON.stringify('false'),
            // empty placeholder, so no unsubstituted process.env reference or
            // real secret can ever appear in the public bundle
            'process.env.API_KEY': JSON.stringify(''),
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
