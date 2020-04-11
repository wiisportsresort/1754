const conc = require('concurrently');

const args = process.argv.slice(2);
let commands = [];

switch (args[0]) {
  case 'serve':
    commands.push({
      command: 'node $DEBUG ./backend/dist/main.js',
      name: 'server',
      prefixColor: 'reset.green.dim',
    });
  case 'build':
    commands.push(
      {
        command: 'webpack $WATCH --config backend/webpack.config.js',
        name: 'backend',
        prefixColor: 'reset.cyan.dim',
      },
      {
        command: 'webpack $WATCH --config frontend/webpack.config.js',
        name: 'frontend',
        prefixColor: 'reset.blue.dim',
      }
    );
    break;
}

commands.forEach(item => {
  switch (args[1]) {
    case 'debug':
      item.command = item.command
        .replace('$DEBUG', '--inspect') // debugger
        .replace('$WATCH', '--watch') // webpack watch files
        .replace('node', 'nodemon'); // nodemon watch built server file
      item.command = `NODE_ENV=development ${item.command}`;
      break;
    case 'dev':
      item.command = item.command
        .replace('$DEBUG', '') // debugger
        .replace('$WATCH', '--watch') // webpack watch files
        .replace('node', 'nodemon'); // nodemon watch built server file
      item.command = `NODE_ENV=development ${item.command}`;
      break;
    case 'prod':
      item.command = item.command
        .replace('$DEBUG', '') // debugger
        .replace('$WATCH', ''); // webpack watch files
      item.command = `NODE_ENV=production ${item.command}`;
  }
});


conc(commands, {
  prefix: '{name}',
  inputStream: process.stdin
});
