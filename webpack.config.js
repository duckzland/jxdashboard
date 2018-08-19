  
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, ''),
        filename: 'dist/build.js'},
    module: {
        loaders: [
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract(['css-loader', 'less-loader'])
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract(['css-loader'])
            },
            {
                test: /\.(png|jpg|woff|woff2|eot|ttf|otf)$/,
                loaders: ['file-loader']
            },
            {
                test: /\.(svg)$/,
                loaders: ['svg-url-loader']
            },
            {
                test: /.js?$/,
                loader: 'babel-loader',
                exclude: [
                    path.resolve(__dirname, 'dist'),
                    path.resolve(__dirname, 'build'),
                    path.resolve(__dirname, 'node_modules')
                ],
                query: {
                    plugins: [
                        'transform-runtime',
                        'transform-class-properties',
                        'transform-es3-member-expression-literals',
                        'transform-es3-property-literals',
                        'syntax-class-properties'
                    ],
                    presets: ['es2015', 'react']
                }
            }
        ]
    },
    watchOptions: {
        ignored: [
            path.resolve(__dirname, 'build'),
            path.resolve(__dirname, 'docs/assets'),
            path.resolve(__dirname, 'node_modules')
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),

        new ExtractTextPlugin({
            filename: 'dist/style.css',
            allChunks: true
        })
    ],
    devtool: 'cheap-module-source-map'
};

