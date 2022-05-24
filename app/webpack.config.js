const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    createOrganization: "./src/createOrganization.js",
    createCert: "./src/createCert.js",
    manage: "./src/manage.js",
    read: "./src/read.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "eval-cheap-source-map",
  plugins: [
    new CopyWebpackPlugin([
      { from: "./src/html/index.html", to: "index.html" },
      { from: "./src/html/create.html", to: "create.html"},
      { from: "./src/html/createOrganization.html", to: "createOrganization.html"},
      { from: "./src/html/createCert.html", to: "createCert.html" },
      { from: "./src/html/read.html", to: "read.html" },
      { from: "./src/html/manage.html", to: "manage.html" },
    ]),
  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true }
};
