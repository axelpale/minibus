/*
 * Gruntfile for Minibus.js
 *
 * Copyright (c) 2013 Akseli Palen
 * Licensed under the MIT license.
 *
 * Installation
 *   npm install                # to install package
 *   npm install -g grunt-cli   # may require sudo
 */

module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Meta options for conveniency
    meta: {
      banner: '\
/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n\
 * <%= pkg.homepage %>\n\
 *\n\
 * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> <<%= pkg.author.email %>>;\n\
 * Licensed under the <%= pkg.license.type %> license */\n\n'
    },

    // Merge source files
    concat: {
      options: {
        separator: '\n\n'
      },
      dist: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: [
          'src/intro.js',
          'src/minibus.js',
          'src/identity.js',
          'src/version.js',
          'src/outro.js'
        ],
        dest: '<%= pkg.name %>.js'
      }
    },

    // Minify the source code
    uglify: {
      options: {
        report: 'gzip',
        banner: '<%= meta.banner %>'
      },
      dist: {
        options: {
          sourceMap: '<%= pkg.name %>.min.map'
        },
        files: {
          '<%= pkg.name %>.min.js': ['<%= pkg.name %>.js'],
        }
      }
    },

    // Check for optimisations and errors
    // http://www.jshint.com/docs/options/
    jshint: {
      options: {
        // Enforcing options
        camelcase: true,
        curly: true,
        eqeqeq: true,
        forin: true,
        freeze: true,
        immed: true,
        //indent: 2,
        maxlen: 80,
        newcap: false,
        noarg: true,
        //noempty: true,
        nonew: true,
        plusplus: true,
        quotmark: 'single',
        undef: true,
        //unused: true, // warn about unused variables
        strict: true,
        trailing: true,

        // Relaxing options, supresses warnings
        //asi: true, missing semicolons
        //boss: true, assignments in weird places
        //eqnull: true,
        //evil: true,
        //expr: true, // expressions in weird places

        // Environment options
        browser: true,
        jquery: true,
        node: true,

        globals: {
          '_': false, // any effect being true or false?
          define: false // ?
        }
      },
      dist: {
        src: ['<%= pkg.name %>.js']
      }
    },

    // Update version in the sources
    replace: {
      dist: {
        options: {
          patterns: [
            {
              match: /\.version\s*=\s*'\d+\.\d+\.\d+'/,
              replacement: ".version = '<%= pkg.version %>'",
              expression: true // use RegExp
            }
          ]
        },
        files: [
          {
            src: ['src/version.js'],
            dest: 'src/version.js'
          }
        ]
      },
      readme: {
        options: {
          patterns: [
            {
              match: />v\d+\.\d+\.\d+</,
              replacement: ">v<%= pkg.version %><",
              expression: true // use RegExp
            }
          ]
        },
        files: [
          {
            src: ['README.md'],
            dest: 'README.md'
          }
        ]
      }
    },

    qunit: {
      dist: {
        options: {
          urls: [
            'http://localhost:8000/test/test-suite.html'
          ]
        },
      }
    },

    // Start server for QUnit tests.
    connect: {
      server: {
        options: {
          port: 8000,
          base: '.'
        }
      }
    }
  });

  // Load tasks
  grunt.loadNpmTasks('grunt-contrib-concat'); // For merging files together
  grunt.loadNpmTasks('grunt-contrib-uglify'); // For minifying
  grunt.loadNpmTasks('grunt-contrib-jshint'); // For sanity testing
  grunt.loadNpmTasks('grunt-contrib-qunit'); // For functional testing
  grunt.loadNpmTasks('grunt-contrib-connect'); // For functional test server
  grunt.loadNpmTasks('grunt-replace'); // For adding versions

  // Default task(s).
  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['replace', 'concat', 'uglify', 'test']);
  grunt.registerTask('test', ['test:syntax', 'test:function']);
  grunt.registerTask('test:syntax', ['jshint']);
  grunt.registerTask('test:function', ['connect', 'qunit']);

};
