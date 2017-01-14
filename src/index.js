import yargs from 'yargs';
import stringHash from 'string-hash';
import genericNames from 'generic-names';
import postcss from 'postcss';
import PostcssModulesLocalByDefault from 'postcss-modules-local-by-default';
import PostcssModulesScope from 'postcss-modules-scope';

/**
 * @class CSSModules
 * @param {Object} [options]
 * @param {string} [options.mode]
 * @param {string} [options.hashPrefix]
 * @param {string|function} [options.generateScopedName]
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

CSSModules.prototype.setOptions = function (options) {
  this.options = yargs.option('mode', {
    describe: '',
    example: 'lessc index.less --css-modules="--mode=global"',
    choices: [ 'global', 'local', 'pure' ]
  }).parse(options);
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

CSSProcessor.prototype.process = function (css) {
  const processor = postcss();

  if (this.options.mode) {
    processor.use(PostcssModulesLocalByDefault({
      mode: this.options.mode
    }));
  }

  const scopedName = do {
    if (this.options.generateScopedName) {
      if (typeof this.options.generateScopedName === 'function') {
        this.options.generateScopedName;

      } else {
        genericNames(this.options.generateScopedName, {
          context: process.cwd(),
          hashPrefix: this.options.hashPrefix
        });
      }

    } else {
      generateScopedName;
    }
  };

  processor.use(PostcssModulesScope({
    generateScopedName: scopedName
  }));

  const result = processor.process(css);
  return result.toString();
};

function generateScopedName (name, filename, css) {
  const i = css.indexOf(`.${name}`);
  const lineNumber = css.substr(0, i).split(/[\r\n]/).length;
  const hash = stringHash(css).toString(36).substr(0, 5);

  return `_${name}_${hash}_${lineNumber}`;
}
