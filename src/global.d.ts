// Allow importing stylesheets for their side effects (bundled by webpack).
declare module '*.css';

// process.env.* is injected at build time by webpack:
// dotenv-webpack in dev/prod builds, DefinePlugin in the gh-pages (mocks) build.
// Declared locally instead of pulling in @types/node for two variables.
declare const process: {
    env: {
        API_URL: string;
        API_KEY: string;
    };
};
