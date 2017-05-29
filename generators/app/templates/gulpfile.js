const argv = require('yargs').argv;
const del = require('del');
const fs = require('fs');
const gulp = require('gulp');
const merge = require('merge2');
const path = require('path');
const plugins = require('gulp-load-plugins')();
const runSequence = require('run-sequence');

/** Component Generation */
gulp.task('default', ['dist']);

gulp.task('dist', function(cb) {
    return runSequence(
        'copy-components',
        'combine-components',
        'generate-build-files',
        'generate-bundle-build-file',
        'compile-components',
        'compile-bundle',
        'cleanup-components',
        cb
    );
});

gulp.task('copy-components', function() {
    return _copyComponent(getFolders('src/components'));
});

gulp.task('combine-components', function() {
    return _combineComponents(getFolders('src/components'));
});

gulp.task('generate-build-files', function() {
    return _generateBuildFiles(getFolders('src/components'));
});

gulp.task('generate-bundle-build-file', function() {
    return _generateBundleBuildFile(getFolders('src/components'));
});

gulp.task('compile-components', function() {
    return _rollup(getFolders('src/components'));
});

gulp.task('compile-bundle', plugins.shell.task(['rollup -c -i src/components.build.js  -o dist/components.js']));

gulp.task('cleanup-components', function() {
    const getTempPaths = (name) => {
        return [
            'src/' + name + '.build.js',
            'src/components/' + name + '/' + name + '.temp.css',
            'src/components/' + name + '/' + name + '.temp.html',
            'src/components/' + name + '/' + name + '.temp.js'
        ];
    };

    var paths = Array.prototype.concat.apply(['src/components.build.js'], getFolders('src/components').map(getTempPaths));

    return del.sync(paths);
});

// copies the components separate files and wraps non-html code in html tags
function _copyComponent(components) {
    const copyCSS = (name) => {
        return gulp.src('src/components/' + name + '/' + name + '.css')
            .pipe(plugins.insert.wrap('<style>\n', '</style>\n'))
            .pipe(plugins.rename(name + '.temp.css'))
            .pipe(gulp.dest('src/components/' + name));
    };
    const copyJS = (name) => {
        return gulp.src('src/components/' + name + '/' + name + '.js')
            .pipe(plugins.insert.wrap('<script>\n', '</script>'))
            .pipe(plugins.rename(name + '.temp.js'))
            .pipe(gulp.dest('src/components/' + name));
    };

    var tasks = components.map(copyCSS)
        .concat(components.map(copyJS));

    return merge(tasks);
}

// combines all the copied separate files into a single html files per component
function _combineComponents(components) {
    const combineFiles = (name) => {
        return gulp.src('src/components/' + name + '/' + name + '.{temp.css,html,temp.js}')
            .pipe(plugins.concat(name + '.temp.html'))
            .pipe(gulp.dest('src/components/' + name + '/'));
    };

    var tasks = components.map(combineFiles);

    return merge(tasks);
}

function _generateBuildFiles(components) {
    components.map((name) => {
        return fs.writeFileSync('src/' + name + '.build.js',
            'import ' + name + ' from \'./components/' + name + '/' + name + '.temp.html\';\nexport default ' + name + ';');
    });

    return true;
}

function _generateBundleBuildFile(components) {
    const importStatement = (name) => {
        return 'import ' + name + ' from \'./components/' + name + '/' + name + '.temp.html\';';
    };

    const exportKVP = (name) => {
        return '\t' + toPascal(name) + ': ' + name;
    };

    var buffer = [
        components.map(importStatement).join('\n'),
        '\nexport default {',
        components.map(exportKVP).join(',\n'),
        '};\n'
    ].join('\n');

    fs.writeFileSync('src/components.build.js', buffer);

    return true;
}

function _rollup(components) {
    var cmds = components.map(getRollupCommand);
    return plugins.shell.task(cmds)();
}

const toPascal = (str) => {
    return str[0].toUpperCase() + str.substring(1);
};

const getRollupCommand = (name) => {
    return 'rollup -c' +
        ' -i src/' + name + '.build.js' +
        ' -o dist/components/' + name + '.js';
};

// gets the name of all directories in a directory
function getFolders(dir) {
    return fs.readdirSync(dir)
      .filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
}
