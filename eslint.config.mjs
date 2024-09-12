import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReactConfig,
  {files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}']},
  {languageOptions: {parserOptions: {ecmaFeatures: {jsx: true}}}},
  {languageOptions: {globals: globals.browser}},
  {
    rules: {
      'no-plusplus': 'off',
      'comma-dangle': ['off'],
      'import/no-extraneous-dependencies': 'off',
      'import/extensions': 'off',
      'import/no-unresolved': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          ignoreRestSiblings: true,
          vars: 'local'
        }
      ],
      'no-shadow': 'off',
      'implicit-arrow-linebreak': 'off',
      'space-before-blocks': 'error',
      'function-paren-newline': 'off',
      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: '*',
          next: 'return'
        },
        {
          blankLine: 'always',
          prev: ['const', 'let', 'var'],
          next: '*'
        },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var']
        }
      ],
      'object-curly-newline': 'off',
      'func-call-spacing': 'off',
      'operator-linebreak': 'off',
      'import/prefer-default-export': 'off',
      'no-spaced-func': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      indent: ['error', 2, {SwitchCase: 1}],
      curly: ['error', 'multi', 'consistent'],
      'no-confusing-arrow': 'off',
      'nonblock-statement-body-position': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': ['error', {allow: ['warn', 'error']}],
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off'
    }
  },
  {
    ignores: [
      '.config/*',
      'ios',
      'android',
      '.prettierrc.js',
      'node_modules',
      'package-lock.json',
      'packages/mobile/babel.config.js',
      'packages/mobile/jest.config.js',
      'packages/mobile/metro.config.js',
      'packages/mobile/react-native.config.js',
      'packages/shared/dist',
      'lint-staged.config.js',
      'packages/mobile/tsconfig.json',
      'packages/web/postcss.config.js'
    ]
  },
  {
    settings: {
      react: {
        version: '^18.3.1'
      }
    }
  }
];
