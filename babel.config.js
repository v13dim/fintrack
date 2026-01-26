module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          assets: './src/assets',
          components: './src/components',
          constants: './src/constants',
          contexts: './src/contexts',
          db: './src/db',
          hooks: './src/hooks',
          localization: './src/localization',
          navigation: './src/navigation',
          screens: './src/screens',
          services: './src/services',
          testUtils: './src/testUtils',
          theme: './src/theme',
          utils: './src/utils',
        },
      },
    ],
    'react-native-reanimated/plugin', // Must be last
  ],
};
