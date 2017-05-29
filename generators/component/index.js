'use strict';
const Generator = require('yeoman-generator');
const fs = require('fs');
const chalk = require('chalk');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('name', {
      type: String,
      required: true,
      description: 'Component name'
    });
  }

  writing() {
    var base = 'src/components/' + this.options.name + '/' + this.options.name;
    var tempate = fs.readFileSync(this.templatePath('componentTemplate.js')).toString();

    if (!fs.existsSync('src/components')) {
      fs.mkdirSync('src/components');
    }
    if (!fs.existsSync('src/components/' + this.options.name)) {
      fs.mkdirSync('src/components/' + this.options.name);
    }

    fs.writeFileSync(this.destinationPath(base + '.js'), tempate);
    fs.writeFileSync(this.destinationPath(base + '.css'), '');
    fs.writeFileSync(this.destinationPath(base + '.html'), '');
  }

  end() {
    console.log('New components added: ' + chalk.green(this.options.name));
  }
};
