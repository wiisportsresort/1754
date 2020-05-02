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

if (args.length === 0) {
  console.error(
    ch`{reset.yellow.dim main} {reset.red.bold Error: no arguments provided. Run "pnpm run help" for usage.}`
  );
  process.exit(1);
}

if (!args[2]) args[2] = '';

const pkgMgr = process.env.npm_config_user_agent.split('/')[0];
const startCmd = pkgMgr === 'yarn' ? 'yarn run' : pkgMgr + ' start';

if (args[0] === 'help') {
  console.log(`
Usage:
  ${pkgMgr} run entry <ACTION> <ENV> [OPTIONS]
    OR
  ${pkgMgr} run <preset name>
    OR
  ${pkgMgr} run keygen

Actions (as comma-separated list)
  build           Build files from "src/" to "dist/".
  serve           Run the express and socket.io server. Also serves 
                    built files from "dist/".

Environment (provide one only)
  dev             Use nodemon as server executable; watch source 
                    files and server files for changes.
  debug           Insert "--inspect" into the server command. 
                    Automatically enables development mode.
  prod            Use ts-node as server executable; enable webpack
                    bundle optimization; output source maps and 
                    licenses.

Options (as comma-separated list)
  timestamps      Show timestamps in front of every "console.log".

Presets ("${pkgMgr} run <preset name>")
  dev             Runs "${pkgMgr} run entry serve,build dev".
  debug           Runs "${pkgMgr} run entry serve,build debug".
  prod            Runs "${pkgMgr} run entry build prod && 
                        ${pkgMgr} run entry serve prod".

Keygen script: generates an RSA 4096-bit public/private keypair in 
  the AES-256 cipher with the passphrase defined in .env 
  (KEY_PASSPHRASE). Useful for the JWT secret.

NOTE: the start script (run by "${startCmd}") is only for redirecting
  execution to another script, e.g. on Glitch (where the start script
  is the only script that can be run).
`);
  process.exit(0);
}

const enableServe = args[0].includes('serve'),
  enableBuild = args[0].includes('build'),
  enableDebug = args[1] === 'debug',
  enableDev = enableDebug || args[1] === 'dev',
  enableProd = args[1] === 'prod',
  showTimestamps = args[2].includes('timestamps');

if (!enableBuild && !enableServe) {
  console.error(
    ch`{reset.yellow.dim main} {reset.red.bold Error: action argument is invalid (must include at least one of "build" | "serve"). Run "pnpm run help" for usage.}`
  );
  process.exit(1);
}

if (!enableDev && !enableProd) {
  console.error(
    ch`{reset.yellow.dim main} {reset.red.bold Error: environment argument is invalid (must be "debug" | "dev" | "prod"). Run "pnpm run help" for usage.}`
  );
  process.exit(1);
}

console.log(ch`{reset.yellow.dim main} {reset.blue Starting ${args[0]} in ${args[1]} mode...}`);

serve.command = serve.command
  .replace('$ENV', `NODE_ENV=${enableDev ? 'development' : 'production'}`)
  .replace('$CMD', enableDev ? 'nodemon' : 'ts-node')
  .replace('$FLAGS', enableDebug ? '--inspect' : '')
  .replace('$ARGS', enableDev ? '' : './server/index.ts');

build.command = build.command
  .replace('$ENV', `NODE_ENV=${enableDev ? 'development' : 'production'}`)
  .replace('$CMD', 'webpack')
  .replace('$FLAGS', enableServe ? '--watch' : '')
  .replace('$ARGS', '');

process.stdin.resume();

const exitSignals = ['SIGINT', 'SIGTERM', 'SIGUSR2'];
exitSignals.forEach(signal =>
  process.on(signal, () => {
    console.log(ch`{reset.yellow.dim main} {reset.red ${signal} received.}`);
    console.log(ch`{reset.yellow.dim main} {reset.yellow Exiting.}`);
    process.exit(0);
  })
);

/* prettier makes this ugly */
// prettier-ignore
const run = [
  ...enableServe ? [serve] : [],
  ...enableBuild ? [build] : [],
];

conc(run, {
  prefix: showTimestamps ? '[{time}] {name}' : '{name}',
  inputStream: process.stdin,
  timestampFormat: 'MM/dd HH:mm:ss',
})
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
