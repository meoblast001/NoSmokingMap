var path = require('path');

module.exports = {
  entry: {
    main: './Client/main.ts'
  },
  output: {
    publicPath: "/dist/",
    path: path.join(__dirname, '/wwwroot/dist/'),
    filename: 'main.build.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
};
