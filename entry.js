const conc = require('concurrently');
const ch = require('chalk');

const serve = {
  command: '$ENV $CMD $FLAGS $ARGS',
  name: 'serve',
  prefixColor: 'reset.green.dim',
};
const build = {
  command: '$ENV $CMD $FLAGS $ARGS',
  name: 'build',
  prefixColor: 'reset.blue.dim',
};

const args = process.argv.slice(2);

const enableServe = args.some(val => val === 'serve'),
  enableDebug     = args.some(val => val === 'debug'),
  enableProd      = args.some(val => val === 'prod'),
  showTimestamps  = args.some(val => val === '-timestamps');

console.log(ch`{reset.yellow.dim main} {reset.blue Starting ${args[0]} in ${args[1]} mode...}`);

serve.command = serve.command
  .replace('$ENV', `NODE_ENV=${enableProd ? 'production' : 'development'}`)
  .replace('$CMD', enableProd ? 'ts-node' : 'nodemon')
  .replace('$FLAGS', enableDebug ? '--inspect' : '')
  .replace('$ARGS', enableProd ? './server/index.ts' : '');

build.command = build.command
  .replace('$ENV', `NODE_ENV=${enableProd ? 'production' : 'development'}`)
  .replace('$CMD', 'webpack')
  .replace('$FLAGS', enableServe ? '--watch' : '')
  .replace('$ARGS', '');

process.stdin.resume();

const exitSignals = ['SIGINT', 'SIGTERM', 'SIGUSR2'];
exitSignals.forEach((signal) =>
  process.on(signal, (sig) => {
    console.log(ch`{reset.yellow.dim main} {reset.red ${signal} received.}`);
    console.log(ch`{reset.yellow.dim main} {reset.yellow Exiting.}`);
    process.exit(0);
  })
);

conc(enableServe ? [serve, build] : [build], {
  prefix: showTimestamps ? '[{time}] {name}' : '{name}',
  inputStream: process.stdin,
  timestampFormat: 'MM/dd HH:mm:ss'
});
