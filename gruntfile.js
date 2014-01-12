(function(){
    'use strict';

    module.exports = function(grunt) {
        // Project Configuration
        grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),
            watch: {
                jade: {
                    files: ['views/**'],
                    options: {
                        livereload: true
                    }
                },
                js: {
                    files: ['gruntfile.js', 'app.js', 'routes/*.js'], // test file e.g. 'test/**/*.js'
                    tasks: ['jshint'],
                    options: {
                        livereload: true
                    }
                },
                css: {
                    files: ['public/stylesheets/**'],
                    options: {
                        livereload: true
                    }
                }
            },
            jshint: {
                all: {
                    src: ['gruntfile.js', 'app.js', 'routes/*.js'],
                    options: {
                        jshintrc: true
                    }
                }
            },
            nodemon: {
                dev: {
                    options: {
                        file: 'app.js',
                        args: [],
                        ignoredFiles: ['public/**'],
                        watchedExtensions: ['js'],
                        nodeArgs: ['--debug'],
                        delayTime: 1,
                        env: {
                            PORT: 3000
                        },
                        cwd: __dirname
                    }
                }
            },
            concurrent: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        });

        //Load NPM tasks
        grunt.loadNpmTasks('grunt-contrib-watch');
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-nodemon');
        grunt.loadNpmTasks('grunt-concurrent');
        grunt.loadNpmTasks('grunt-env');

        //Making grunt default to force in order not to break the project.
        grunt.option('force', true);

        //Default task(s).
        grunt.registerTask('default', ['jshint', 'concurrent']);

    };
})();