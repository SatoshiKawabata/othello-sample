module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  output: {
    path: `${__dirname}/docs`,
    filename: "index.js"
  },
  devServer: {
    contentBase: "./docs",
    port: "8888"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader?modules" }
        ]
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader"
      }
    ]
  },
  resolve: {
    extensions: [
      ".ts", ".tsx", ".js", ".json"
    ]
  }
};