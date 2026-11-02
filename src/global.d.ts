// Allow importing stylesheets for their side effects (bundled by webpack).
declare module '*.css';

// process.env.* is injected at build time by dotenv-webpack (DefinePlugin).
// Declared locally instead of pulling in @types/node for two variables.
declare const process: {
    env: {
        API_URL: string;
        API_KEY: string;
    };
};
