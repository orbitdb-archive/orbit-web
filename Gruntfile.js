"use strict";

function mountFolder(connect, dir) {
  return connect.static(require("path").resolve(dir));
}

const webpackDistConfig = require("./config/webpack.config.dist.js");
const webpackDevConfig = require("./config/webpack.config.js");

module.exports = function(grunt) {
  // Let *load-grunt-tasks* require everything
  require("load-grunt-tasks")(grunt);

  // Read configuration from package.json
  const pkgConfig = grunt.file.readJSON("package.json");

  // Init
  grunt.initConfig({
    pkg: pkgConfig,

    webpack: {
      options: webpackDistConfig,
      dist: {}
    },

    "webpack-dev-server": {
      options: {
        hot: true,
        inline: true,
        port: 8000,
        webpack: webpackDevConfig,
        publicPath: "/assets/",
        contentBase: "./<%= pkg.build.src %>/"
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
          middleware: function(connect) {
            return [mountFolder(connect, pkg.build.target)];
          }
        }
      }
    },

    open: {
      options: {
        delay: 500
      },
      dev: {
        path: "http://localhost:<%= connect.options.port %>/"
      },
      dist: {
        path: "http://localhost:<%= connect.options.port %>/"
      }
    },

    karma: {
      unit: {
        configFile: "karma.conf.js"
      }
    },

    copy: {
      dist: {
        files: [
          // includes files within path
          {
            flatten: true,
            expand: true,
            src: ["<%= pkg.build.src %>/*"],
            dest: "<%= pkg.build.target %>/",
            filter: "isFile"
          },
          {
            flatten: true,
            expand: true,
            src: ["<%= pkg.build.src %>/images/*"],
            dest: "<%= pkg.build.target %>/images/"
          },
          {
            flatten: true,
            expand: true,
            src: ["<%= pkg.build.src %>/icons/**/*"],
            dest: "<%= pkg.build.target %>/icons/"
          },
          {
            expand: true,
            cwd: "<%= pkg.build.src %>/fonts/",
            src: ["**/*.woff2", "**/*.txt}"],
            dest: "<%= pkg.build.target %>/fonts/"
          },
          {
            flatten: true,
            expand: true,
            src: ["<%= pkg.build.src %>/lib/**/*.js"],
            dest: "<%= pkg.build.target %>/lib/"
          }
        ]
      }
    },

    clean: {
      dist: {
        files: [
          {
            dot: true,
            src: ["<%= pkg.build.target %>"]
          }
        ]
      },
      npm: ["node_modules/ipfs-api", "node_modules/ipfs/node_modules/ipfs-api"]
    }
  });

  // Tasks
  grunt.registerTask("serve", function(target) {
    if (target === "dist") {
      // Use "force" here since all environments can not "open" a browser
      return grunt.task.run(["build", "open:dist", "force:connect:dist"]);
    }

    // Use "force" here since all environments can not "open" a browser
    grunt.task.run(["open:dev", "force:webpack-dev-server"]);
  });

  grunt.registerTask("test", ["karma"]);

  grunt.registerTask("build", ["clean:dist", "copy"]);

  grunt.registerTask("default", []);
};
