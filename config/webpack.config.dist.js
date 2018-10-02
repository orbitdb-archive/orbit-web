"use strict";

const common = require("./webpack.common.js");

const config = {
  mode: "production",
  entry: {
    app: "./src/components/App.js"
  }
};

module.exports = Object.assign(config, common);
