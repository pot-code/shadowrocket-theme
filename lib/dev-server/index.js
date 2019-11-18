const express = require('express');
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const portfinder = require('portfinder');
const logger = require('webpack-log');
const chalk = require('chalk');
const boxen = require('boxen');
const { stripIndent } = require('common-tags');

const app = express();
const config = require('../../build/webpack.config.dev');
const {
  assets_table,
  print_banner,
  print_assets_table,
  create_uri,
  to_network_table,
  get_network_address,
  once
} = require('./utils');

const DEFAULT_PORT = 8080;
const publicPath = config.devServer.publicPath || '/';
const compiler = webpack(config);
const log = logger({
  name: 'dev-server',
  level: 'info',
});

portfinder.basePort = config.devServer.port || DEFAULT_PORT;

app.use(devMiddleware(compiler, {
  publicPath, logLevel: 'silent', watchOptions: {
    aggregateTimeout: 600
  }
}));
app.use(hotMiddleware(compiler, {
  log: false,
  path: '/__hmr'
}));

compiler.hooks.done.tap('WebpackDevServer', once(print_assets_table));

async function start_server() {
  await print_banner();

  const port = await portfinder.getPortPromise();
  const addresses = get_network_address();
  const urls = addresses.map(address => ({
    ...address,
    address: chalk.cyan(create_uri('http', address.address, port, publicPath))
  }))

  app.listen(port, () => {
    console.log(boxen(stripIndent`
      ${chalk.green('Dev server started')}
      ${to_network_table(urls)}
    `, {
        borderColor: 'blueBright',
        padding: 1,
        borderStyle: 'round'
      }))
  });
}

start_server();
