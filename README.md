# generator-svelte-workbench [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url]
> A structured workspace for creating and packaging svelte components.

This workspace created by this generator comes with a few key features that helps you to start writing components sooner, maintain them, and distribute.  

It comes with [Rollup](https://github.com/rollup/rollup) for module bundling and [Bublé](https://www.npmjs.com/package/buble) to allow for ES2015/16 JavaScript code to be used in your components without needing to worry about browser/environment support.  

The other main feature is the file structure that is supported. Rather than putting the css, html and js for a component in a single file, they are all split up and a gulp task takes care of the rest.  


## Installation

First, install [Yeoman](http://yeoman.io) and generator-svelte-workbench using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-svelte-workbench
```

Then generate your new project:

```bash
yo svelte-workbench
```

## Ongoing Usage

Once your project is configured, you can continue to use this project to help create boiler plate files and code.

To create stubs for a new component run:

```bash
yo svelte-workbench:component componentName
```

For example, if you want to add a new component named button:

```bash
yo svelte-workbench:component button
```

This will add a new component named button being created.

## License

MIT © [Zachariah Brown](zachariahwbrown.com)


[npm-image]: https://badge.fury.io/js/generator-svelte-workbench.svg
[npm-url]: https://npmjs.org/package/generator-svelte-workbench
[travis-image]: https://travis-ci.org/ZacBrownBand/generator-svelte-workbench.svg?branch=master
[travis-url]: https://travis-ci.org/ZacBrownBand/generator-svelte-workbench
[daviddm-image]: https://david-dm.org/ZacBrownBand/generator-svelte-workbench.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/ZacBrownBand/generator-svelte-workbench
