const path = require('path');

module.exports = {
    entry: {
        main: './app.js'
    },
   
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
      },
    mode: 'development',
    target: 'node',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.html$/,
                use: 'html-loader'
            },
            {
                test: /\.node$/,
                loader: 'raw-loader'
            },
            {
                test: /\.cs$/,
                loader: 'null-loader'
            }
        ]
    }
};