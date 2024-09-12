module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['module:react-native-dotenv',
    {
      moduleName: '@env',
      path: '.env',
      blocklist: null,
      allowlist: null,
      safe: false,
      allowUndefined: true,
    },
    ],
    [
      'module-resolver',
      {
        alias: {
          // This needs to be mirrored in tsconfig.json,
          '@assets': './src/assets',
          '@components': './src/components',
          '@constants': './src/constants',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@utils': './src/utils',
          '@interface': './src/interface',
          '@api': './src/api',
          '@reducers': './src/reducers',
          '@hooks': './src/hooks',
          '@src': './src',
        },
      },
    ],
    ['@babel/plugin-transform-private-methods', { loose: true }],
  ],
};