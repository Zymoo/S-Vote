/**
 * Compiles all smart contracts specified in createConfiguration()
 * and saves them as JSON files in build/ folder
 * build/ folder is emptied before compilation
 */
const solc = require('solc');
const fs = require('fs-extra');
const path = require('path');

exports.compile = function() {
  const buildPath = cleanup();
  const config = createConfiguration();
  const compiled = compileSources(config);
  writeOutput(compiled, buildPath);
};


/**
 * Clean up build folder before compilation
 * @return {string} path to build folder
 */
function cleanup() {
  const buildPath = path.resolve(__dirname, 'build');
  fs.removeSync(buildPath);

  return buildPath;
}

/**
 * Creates JSON object with compilation specifics
 * @return {object} JSON contract object
 */
function createConfiguration() {
  return {
    language: 'Solidity',
    sources: {
      'Test.sol': {
        content: fs.readFileSync(
            path.resolve(__dirname, 'contracts', 'Test.sol'), 'utf8'),
      },
      // add more contracts here
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode'],
        },
      },
    },
  };
}

/**
 * Compiles the sources, defined in the config object
 * @param {object} config - configuration object
 * @return {any} - object with compiled sources
 */
function compileSources(config) {
  try {
    return JSON.parse(solc.compile(JSON.stringify(config)));
  } catch (e) {
    console.log(e);
  }
}

/**
 * Writes the contracts from the compiled sources into JSON files
 * @param {object} compiled object containing compiled contracts
 * @param {string} buildPath path to the build folder
 */
function writeOutput(compiled, buildPath) {
  // check if folder exists
  fs.ensureDirSync(buildPath);

  // eslint-disable-next-line guard-for-in
  for (const contractFileName in compiled.contracts) {
    const contractName = contractFileName.replace('.sol', '');
    console.log('Writing: ', contractName + '.json');
    fs.outputJsonSync(
        path.resolve(buildPath, contractName + '.json'),
        compiled.contracts[contractFileName][contractName],
    );
  }
}
