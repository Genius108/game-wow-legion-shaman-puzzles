const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    entry: {
        'index': './src/app/index.jsx',
        'breeder': './src/app/breeder.js',
    },
    output: {
        path: './build',
        filename: '[name].js',
        chunkFilename: '[id].js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components|tmp)/,
                loader: 'babel'
            },
            {
                test: /\.styl$/,
                loader: 'style!css!autoprefixer!stylus'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
              new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new HtmlWebpackPlugin({
            excludeChunks: ['breeder'],
            inject: 'body',
            filename: './index.html',
            template: './src/index.html'
        })
    ]
};
