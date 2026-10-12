# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules. Code is formatted with Prettier.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Linting and formatting

- `npm run lint` — run ESLint (`eslint.config.js`)
- `npm run format` — format all files with Prettier (`.prettierrc.json`)
- `npm run format:check` — check formatting without writing

`eslint-config-prettier` disables ESLint rules that conflict with Prettier.

For type-aware lint rules, replace `tseslint.configs.recommended` with `tseslint.configs.recommendedTypeChecked` in `eslint.config.js` and set `languageOptions.parserOptions.projectService: true`. See the [typescript-eslint docs](https://typescript-eslint.io/getting-started/typed-linting).
