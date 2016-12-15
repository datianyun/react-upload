module.exports = {
  entry: {
    'dist/upload': './index.js',
    'example/bundle': './example/app.js',
  },
  output: {
    path: __dirname,
    filename: '[name].js'
  },
  module: {
    loaders: [
        {
          test: /\.(js|jsx)$/,     
          exclude: /node_modules/,
          loader: "babel",
          query:
            {
              presets:['es2015', 'react']
            }
        },
        {test: /\.json$/, loader: 'json-loader'},
        {test: /\.css$/, loader: "style-loader!css-loader"},
        {test: /\.less$/, loader: "style-loader!css-loader!less-loader"},
        {test: /\.scss$/, loader: "style-loader!css-loader!sass-loader"}
    ]
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  devtool: 'source-map'
};
