'use strict'

var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir))
}

var webpackDistConfig = require('./config/webpack.config.dist.js'),
    webpackDevConfig = require('./config/webpack.config.js')

module.exports = function (grunt) {
  // Let *load-grunt-tasks* require everything
  require('load-grunt-tasks')(grunt)

  // Read configuration from package.json
  var pkgConfig = grunt.file.readJSON('package.json')

  grunt.initConfig({
    pkg: pkgConfig,

    webpack: {
      options: webpackDistConfig,
      dist: {}
    },

    'webpack-dev-server': {
      options: {
        hot: true,
        inline: true,
        port: 8000,
        webpack: webpackDevConfig,
        publicPath: '/assets/',
        contentBase: './<%= pkg.build.src %>/',
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true"
        },
      },

      start: {
        keepalive: true
      }
    },

    connect: {
      options: {
        port: 8000
      },

      dist: {
        options: {
          keepalive: true,
          middleware: function (connect) {
            return [
              mountFolder(connect, pkg.build.target)
            ]
          }
        }
      }
    },

    open: {
      options: {
        delay: 500
      },
      dev: {
        // path: 'http://localhost:<%= connect.options.port %>/webpack-dev-server/'
        path: 'http://localhost:<%= connect.options.port %>/'
      },
      dist: {
        path: 'http://localhost:<%= connect.options.port %>/'
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },

    copy: {
      dist: {
        files: [
          // includes files within path
          {
            flatten: true,
            expand: true,
            src: ['<%= pkg.build.src %>/*'],
            dest: '<%= pkg.build.target %>/',
            filter: 'isFile'
          },
          {
            flatten: true,
            expand: true,
            src: ['<%= pkg.build.src %>/images/*'],
            dest: '<%= pkg.build.target %>/images/'
          },
          {
            flatten: true,
            expand: true,
            src: ['<%= pkg.build.src %>/icons/**/*'],
            dest: '<%= pkg.build.target %>/icons/'
          },
          {
            expand: true,
            cwd: '<%= pkg.build.src %>/fonts/',
            src: ['**/*.woff2', '**/*.txt}'],
            dest: '<%= pkg.build.target %>/fonts/'
          },
          {
            flatten: true,
            expand: true,
            src: ['<%= pkg.build.src %>/lib/**/*.js'],
            dest: '<%= pkg.build.target %>/lib/'
          }
        ]
      }
    },

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= pkg.build.target %>'
          ]
        }]
      },
      npm: [
        'node_modules/ipfs-api',
        'node_modules/ipfs/node_modules/ipfs-api'
      ]
    }
  })

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open:dist', 'connect:dist'])
    }

    grunt.task.run([
      'open:dev',
      'webpack-dev-server'
    ])
  })

  grunt.registerTask('test', ['karma'])

  // grunt.registerTask('build', ['clean:dist', 'copy', 'webpack'])
  grunt.registerTask('build', ['clean:dist', 'copy'])

  grunt.registerTask('default', [])
}
