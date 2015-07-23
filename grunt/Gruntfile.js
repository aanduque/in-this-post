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
      
      copy: {
        // Copy the plugin to a versioned release directory
        main: {
          cwd: '../',
          expand: true,
          src: [
          '**',
          '!grunt/**',
          '!release/**',
          '!.git/**',
          '!.svn/**',
          '!.idea/**',
          '!.sass-cache/**',
          '!assets/less/**',
          '!assets/js/plugins/**',
          '!assets/js/_*.js',
          '!assets/img/src/**',
          '!Gruntfile.js',
          '!package.json',
          '!.gitignore',
          '!.gitmodules'
          ],
          dest: '../release/<%= pkg.version %>/'
        }
      },

      compress: {
        main: {
          options: {
            mode: 'zip',
            archive: './../release/<%= pkg.name %>.<%= pkg.version %>.zip'
          },
          expand: true,
          cwd: '../release/<%= pkg.version %>/',
          src: ['**/*'],
          dest: '<%= pkg.name %>/'
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
    
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');

    // Register tasks
    grunt.registerTask('dev', [
      'jshint',
      'cssmin',
      'uglify',
    ]);
    
    grunt.registerTask('build', ['dev', 'copy', 'compress']);

  };