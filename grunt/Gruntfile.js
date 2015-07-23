  'use strict';
  module.exports = function (grunt, init) {

    grunt.initConfig({

      pkg: grunt.file.readJSON('package.json'),

      jshint: {
        options: {
          jshintrc: '.jshintrc'
        },
        all: [
        '../*.js',
        ]
      },

      cssmin: {
        options: {
          banner: '/*! <%= pkg.title %> - v<%= pkg.version %>\n' +
          ' * <%= pkg.homepage %>\n' +
          ' * Copyright (c) <%= grunt.template.today("yyyy") %>;' +
          ' */\n'
        },

        minify: {
          expand: true,

          cwd: '../',
          src: ['*.css', '!*.min.css'],

          dest: '../dist/',
          ext: '.min.css'
        }
      },

      uglify: {
        dist: {
          files: {
            
            // Dist
            '../dist/jquery.inThisPost.min.js': [
            '../*.js',
            ],
            
          },

          options: {
            // JS source map: to enable, uncomment the lines below and update sourceMappingURL based on your install
            // sourceMap: '../assets/js/scripts.min.js.',
            // sourceMappingURL: '/app/themes/roots/assets/js/scripts.min.js.map'
          }
        }
      },
      
      watch: {
        js: {
          files: [
          '../*.js',
          ],
          tasks: ['dev'],
          options: {
            livereload: true,
          },
        },
      }
    });

    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Register tasks
    grunt.registerTask('dev', [
      'jshint',
      'cssmin',
      'uglify',
    ]);

  };