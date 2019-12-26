const fs = require('fs');
const path = require('path');

const {
  getRelativePath,
  ensureFileDirectoryExists,
} = require('../utils/pathHelper');
const { encoding } = require('../constants');

function getRelativePaths(fromDir, files) {
  return files
    .map(file => getRelativePath(file, fromDir))
    .concat()
    .sort();
}

const formatter = (files, frms, separator) => {
  const formatted = files.map(f => frms(f));
  return formatted.join(separator);
};

const shortname = v => v.match(/([^\/]*)\/*$/)[1];

const template = files =>
  `// Auto-generated file created by react-native-storybook-loader
// Do not edit.
//
// https://github.com/elderfo/react-native-storybook-loader.git

function loadStories() {
  const components = {};
${formatter(
  files,
  file => `  components['${shortname(file)}'] = require('${file}');`,
  '\n'
)}
  return components;
}

const stories = [
${formatter(files, file => `  '${file}'`, ',\n')}
];

module.exports = {
  loadStories,
  stories,
};
`;

const writeFile = (files, outputFile) => {
  const relativePaths = getRelativePaths(path.dirname(outputFile), files).map(
    file => file.substring(0, file.lastIndexOf('.'))
  ); // strip file extensions

  const output = template(relativePaths);

  ensureFileDirectoryExists(outputFile);

  fs.writeFileSync(outputFile, output, { encoding });
};

module.exports = {
  writeFile,
};
