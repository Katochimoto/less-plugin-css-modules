import yargs from 'yargs';
import genericNames from 'generic-names';
import postcss from 'postcss';
import PostcssModulesLocalByDefault from 'postcss-modules-local-by-default';
import PostcssModulesScope from 'postcss-modules-scope';

const OPTIONS = {
  mode: {
    describe: '',
    example: 'lessc index.less --css-modules="--mode=global"',
    choices: [ 'global', 'local', 'pure' ]
  },
  hashPrefix: {
    describe: '',
    example: 'lessc index.less --css-modules="--hashPrefix=project_name"',
    type: 'string'
  },
  generateScopedName: {
    describe: '',
    example: 'lessc index.less --css-modules="--generateScopedName=[name]__[local]___[hash:base64:5]"',
    type: 'string'
  }
};

/**
 * @class CSSModules
 * @param {Object} [options]
 * @param {string} [options.mode]
 * @param {string} [options.hashPrefix]
 * @param {string|function} [options.generateScopedName='[name]__[local]___[hash:base64:5]']
 */
function CSSModules (options = {}) {
  this.options = options;
}

CSSModules.prototype.minVersion = [ 2, 1, 0 ];

CSSModules.prototype.install = function (less, pluginManager) {
  pluginManager.addPostProcessor(new CSSProcessor(this.options));
};

CSSModules.prototype.printUsage = function () {
  console.log('');
  console.log('CSS Modules Plugin');
  console.log('specify plugin with --css-modules');
  console.log('');
};

/**
 * @param {string} options
 */
CSSModules.prototype.setOptions = function (options) {
  this.options = yargs.options(OPTIONS).parse(options);
};

export default CSSModules;

/**
 * @class CSSProcessor
 * @param {Object} [options]
 * @param {string} [options.mode]
 * @param {string} [options.hashPrefix]
 * @param {string|function} [options.generateScopedName]
 */
function CSSProcessor (options = {}) {
  this.options = options;
}

/**
 * [process description]
 * @param {string} css
 * @returns {string}
 */
CSSProcessor.prototype.process = function (css) {
  const processor = postcss();

  if (this.options.mode) {
    processor.use(PostcssModulesLocalByDefault({
      mode: this.options.mode
    }));
  }

  const typeGenerateScopedName = typeof this.options.generateScopedName;
  const pattern = typeGenerateScopedName === 'string' ? this.options.generateScopedName : '[name]__[local]___[hash:base64:5]';
  const scopedName = do {
    if (typeGenerateScopedName === 'function') {
      this.options.generateScopedName;
    } else {
      genericNames(pattern, {
        context: process.cwd(),
        hashPrefix: this.options.hashPrefix
      });
    }
  };

  processor.use(PostcssModulesScope({
    generateScopedName: scopedName
  }));

  const result = processor.process(css);
  return result.toString();
};
