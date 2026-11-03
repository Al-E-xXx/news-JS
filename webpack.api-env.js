const API_PROXY_URL = 'https://rss-news-api.onrender.com/';

const API_MOCK_URL = 'mocks/';

const OBFUSCATION_MASK = 90;

function maskKey(key) {
    const codes = [...key].map((char) => char.charCodeAt(0) ^ OBFUSCATION_MASK);
    return `[${codes.join(',')}].map((code) => String.fromCharCode(code ^ ${OBFUSCATION_MASK})).join('')`;
}

function apiDefines({ apiKey = '', maskApiKey = false }) {
    return {
        'process.env.API_URL': JSON.stringify(API_PROXY_URL),
        'process.env.API_MOCK_URL': JSON.stringify(API_MOCK_URL),
        'process.env.API_KEY': maskApiKey && apiKey ? maskKey(apiKey) : JSON.stringify(apiKey),
    };
}

module.exports = { API_PROXY_URL, API_MOCK_URL, apiDefines };
