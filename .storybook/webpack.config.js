function for_name(module_name) {
  return require.resolve(module_name);
}

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: for_name('ts-loader'),
      },
    ],
  }, {
      test: /\.less$/,
      use: [for_name("style-loader"), {
        loader: for_name('css-loader'),
        options: {
          modules: 'local',
          importLoaders: 1,
          localIdentName: '[name]-[local]__[hash:base64:5]',
          camelCase: 'dashes'
        }
      }, for_name('less-loader')]
    });
  config.resolve.extensions.push('.ts', '.tsx');
  return config;
};
