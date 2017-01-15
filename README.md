# less-plugin-css-modules
A less plugin for css modules.

[![Build Status][build]][build-link] [![NPM version][version]][version-link] [![Dependency Status][dependency]][dependency-link] [![devDependency Status][dev-dependency]][dev-dependency-link]

```js
// rollup.config.js
import RollupPluginLess2 from 'rollup-plugin-less2';
import LessPluginCssModules from 'less-plugin-css-modules';

// ...

export default {
  // ...
  plugins: [
    RollupPluginLess2({
      output: false,
      cssModules: true,
      options: {
        plugins: [
          new LessPluginCssModules({
            mode: 'local',
            hashPrefix: 'test',
            generateScopedName: '[local]___[hash:base64:5]'
          })
        ]
      }
    })
  ]
};
```

[build]: https://travis-ci.org/Katochimoto/less-plugin-css-modules.svg?branch=master
[build-link]: https://travis-ci.org/Katochimoto/less-plugin-css-modules
[version]: https://badge.fury.io/js/less-plugin-css-modules.svg
[version-link]: http://badge.fury.io/js/less-plugin-css-modules
[dependency]: https://david-dm.org/Katochimoto/less-plugin-css-modules.svg
[dependency-link]: https://david-dm.org/Katochimoto/less-plugin-css-modules
[dev-dependency]: https://david-dm.org/Katochimoto/less-plugin-css-modules/dev-status.svg
[dev-dependency-link]: https://david-dm.org/Katochimoto/less-plugin-css-modules#info=devDependencies
