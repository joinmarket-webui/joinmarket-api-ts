const path = require("path");

module.exports = {
  //mode: "production",
  mode: "development",
  entry: "./src/jm-wallet-rpc/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: "JoinMarketApi",
  },
  resolve: {
    extensions: [".ts"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
};