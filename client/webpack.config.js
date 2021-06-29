const path = require('path');
// const CssExtract = require('mini-css-extract-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'app.js',
        path: path.resolve('.')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader'
            }, 
            {
                test: /\.css/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.scss/,
                use: [ 'style-loader', 'css-loader', 'sass-loader' ]
            },
        ]
    },
    plugins: [
        // new CssExtract()
    ]
};