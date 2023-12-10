#!/usr/bin/env node

const nodeprocess = require('node:process');
const parser = require('args-parser');

const { serverFromConfig } = require('./wss/wss');
const { oscServerFromConfig } = require('./osc/osc');
const { midiSinkFromConfig, midiSourcesFromConfig } = require('./midi/raw-midi');
const { getConfig, assertType } = require('./config/config');

let context = {}

// Which process is using port 80 (the only port which seems to work without extra config on macos):
// sudo lsof -i -P | grep LISTEN | grep :80  # lists processes using  a port containing 80  
// sudo lsof -i :80 # process using port 80 
// sudo kill -9 PID # kill process with a given PID
// sudo kill -9 $(sudo lsof -t -i :80) # one liner

function run() {

  try {
    const args = parser(process.argv);
    const config = getConfig(args.config ?? 'midi');
  
    assertType('server', config, 'object', true);
    assertType('oscSource', config, 'object');
    assertType('midiSource', config, 'object');
    assertType('midiSink', config, 'object');
    
    const strict = args.strict;

    context.wss = serverFromConfig(config.server);
  
    if (config.oscSource) {
      context.oscServer = oscServerFromConfig(config.oscSource, context.wss);
    }
  
    if (config.midiSink) {
      context.midiSink = midiSinkFromConfig(config.midiSink, context.wss, strict);
    }
    
    if (config.midiSource) {
      context.midiSources = midiSourcesFromConfig(config.midiSource, context.wss, strict);
    }
  } catch (e) {
    console.error(e);
  }

  
}

run();

nodeprocess.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
  context.wss.close();
});

nodeprocess.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down gracefully...');
  process.exit(0);
});