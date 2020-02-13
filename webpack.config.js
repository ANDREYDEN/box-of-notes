const path = require('path')

module.exports = {
    mode: 'development',
    entry: {
        app: './app.js',
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'app.bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: path.resolve(__dirname, 'node_modules'),
            use: {
                loader: 'babel-loader',
                options:  {
                    presets: ['@babel/preset-env']
                }
            }
        }]
    },
    node: {
        fs: 'empty'
    }
}