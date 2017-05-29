'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const extend = require('deep-extend');
const fs = require('fs');

module.exports = class extends Generator {
  initializing() {}

  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('svelte-workbench') + ' generator!'
    ));

    const prompts = [{
      type: 'input',
      name: 'projectName',
      message: 'Your project name',
      default: process.cwd().split(path.sep).pop()
    }, {
      type: 'input',
      name: 'description',
      message: 'Project description'
    }, {
      type: 'list',
      name: 'format',
      message: 'Component module format',
      default: 3,
      choices: ['amd', 'cjs', 'es', 'iife', 'umd']
    }, {
      type: 'input',
      name: 'moduleName',
      message: 'Module name',
      default: process.cwd().split(path.sep).pop()
    }, {
      type: 'confirm',
      name: 'sample',
      message: 'Include a sample component',
      default: true
    }];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    var fileMap = {
      'package.json': 'package.json',
      'gulpfile.js': 'gulpfile.js',
      'gitignore': '.gitignore'
    };

    if (this.props.sample) {
      fileMap['sample/sampleComponent/sampleComponent.js'] = 'src/components/sampleComponent/sampleComponent.js';
      fileMap['sample/sampleComponent/sampleComponent.css'] = 'src/components/sampleComponent/sampleComponent.css';
      fileMap['sample/sampleComponent/sampleComponent.html'] = 'src/components/sampleComponent/sampleComponent.html';
      fileMap['sample/componentTestPage.html'] = 'componentTestPage.html';
    }

    var file = Object.keys(fileMap);
    for (let i = 0, len = file.length; i < len; i++) {
      this.fs.copy(
        this.templatePath(file[i]),
        this.destinationPath(fileMap[file[i]])
      );
    }

    var conf = fs.readFileSync(this.templatePath('rollup.config.js')).toString();
    conf = conf.replace(/\/\*\|format\|\*\/.*\/\*\|format\|\*\//ig,
          '/*|format|*/format: \'' + this.props.format + '\', /*|format|*/')
        .replace(/\/\*\|moduleName\|\*\/.*\/\*\|moduleName\|\*\//ig,
          '/*|moduleName|*/moduleName: \'' + this.props.moduleName + '\', /*|moduleName|*/');
    fs.writeFileSync(this.destinationPath('rollup.config.js'), conf);

    const pkg = this.fs.readJSON(this.destinationPath('package.json'));
    extend(pkg, {
      name: this.props.projectName,
      description: this.props.description
    });
    this.fs.writeJSON(this.destinationPath('package.json'), pkg);
  }

  conflicts() {}

  install() {
    this.installDependencies({
      bower: false,
      npm: true,
      callback: function () {
        this.spawnCommand('gulp', ['dist']);
      }.bind(this)
    });
  }
};
