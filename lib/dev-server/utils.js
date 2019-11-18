const { table, getBorderCharacters } = require('table');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const url = require('url');
const prettyBytes = require('pretty-bytes');
const os = require('os');

const ASSETS_TABLE_HEADER = ['Asset', 'Size', 'Chunks', 'Chunk Names', 'Emitted'].map(text => chalk.gray.bold(text))
const SIZE_ALERT_THRESHOLD = 2097152;//2MB
const SIZE_WARNING_THRESHOLD = 1048576;//1MB

const assetVisitor = {
  name: function (name) {
    return chalk.bold.green(name);
  },
  size: function (size) {
    const sizeStr = prettyBytes(size);

    // highlight large file size
    if (size > SIZE_ALERT_THRESHOLD) {
      return chalk.bgRed(sizeStr);
    }
    if (size > SIZE_WARNING_THRESHOLD) {
      return chalk.bgYellow(sizeStr);
    }
    return sizeStr;
  },
  chunks: function (chunks) {
    return chalk.bold(chunks.join(' '));
  },
  emitted: function (emitted) {
    return emitted ? chalk.green.bold('true') : '';
  },
  chunkNames: function (chunkNames) {
    return chunkNames.join(' ');
  }
}

function assets_table(assets) {
  const table_config = {
    border: getBorderCharacters('norc')
  }
  const body = assets
    .filter(asset => !asset.name.includes('hot-update'))
    .map(asset => Object.keys(asset)
      .filter(prop => (prop in assetVisitor))
      .map(prop => (assetVisitor[prop](asset[prop])))
    );

  return table([ASSETS_TABLE_HEADER, ...body], table_config);
}

function print_assets_table(stats) {
  const { assets } = stats.toJson({
    all: false,
    assets: true,
  });

  if (!stats.hasErrors() && !stats.hasWarnings()) {
    console.log(assets_table(assets));
  }
}

function to_network_table(addresses) {
  const table_config = {
    border: getBorderCharacters('void')
  }
  const body = [...addresses.map(address => ([address.internal ? 'internal' : 'external', address.address]))];

  return table(body, table_config);
}

function print_banner() {
  return new Promise((res, rej) => {
    const bannerSource = fs.createReadStream(path.resolve(__dirname, 'banner'), { autoClose: true });
    let str = '';

    bannerSource.on('data', (chunk) => {
      str += chunk;
    });

    bannerSource.once('end', () => {
      console.log(chalk.green(str));
      res();
    });
  });
}

function get_network_address() {
  const interfaces = os.networkInterfaces()
  const addresses = [];

  for (let interface in interfaces) {
    for (let address of interfaces[interface]) {
      if (address.family === 'IPv4') {
        addresses.push(address);
      }
    }
  }

  return addresses;
}

function create_uri(protocol, hostname, port, pathname) {
  return url.format({
    protocol,
    hostname,
    port,
    pathname
  });
}

function once(fn) {
  let invoked = false;

  return function (...args) {
    if (!invoked) {
      fn(...args)
      invoked = true;
    }
  }
}

module.exports = {
  assets_table,
  print_banner,
  create_uri,
  print_assets_table,
  to_network_table,
  get_network_address,
  once
}
