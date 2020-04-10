import { series, parallel } from 'gulp';
import webpack from 'webpack';
import frontendConfig from './frontend/webpack.config';
import backendConfig from './backend/webpack.config';
import { exec } from 'child_process';

function buildFrontend(cb) {
  return new Promise((resolve, reject) => {
    webpack(frontendConfig, (err, stats) => {
      if (err) return reject(err);
      if (stats.hasErrors()) {
        return reject(new Error(stats.compilation.errors.join('\n')));
      }

      resolve();
    });
  });
}
function buildBackend(cb) {
  return new Promise((resolve, reject) => {
    webpack(backendConfig, (err, stats) => {
      if (err) return reject(err);
      if (stats.hasErrors()) {
        return reject(new Error(stats.compilation.errors.join('\n')));
      }

      resolve();
    });
  });
}
function runBackend(cb) {
  const process = exec('pnpx run start', function (error, stdout, stderr) {
    if (error) {
      console.log(error.stack);
      console.log('Error code: ' + error.code);
      console.log('Signal received: ' + error.signal);
    }
    console.log('Child Process STDOUT: '+stdout);
    console.log('Child Process STDERR: '+stderr);
  });
  
  process.on('exit', function (code) {
    console.log('Child process exited with exit code '+code);
  });
}

const defaultTask = series(
  // build with webpack
  parallel(buildBackend, buildFrontend),
  // run the backend
);
