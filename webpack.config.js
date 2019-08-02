  
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var UglifyJSPlugin = require('uglifyjs-3-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    entry: './app/index.js',
    output: {
        path: __dirname + '/dist',
        filename: 'build.js'
    },
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
                test: /\.(png|jpg|webp|jpeg|gif|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'images/'
                        }
                    }
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            },
            {
                test: /.js?$/,
                loader: 'babel-loader',
                exclude: [
					path.resolve(__dirname, 'scripts'),
				    path.resolve(__dirname, 'docs'),
                    path.resolve(__dirname, 'build'),
                    path.resolve(__dirname, 'node_modules')
                ],
                query: {
                    plugins: [
                        'lodash',
                        'transform-runtime',
                        'transform-class-properties',
                        'syntax-class-properties'
                    ],
                    presets: ['es2015', 'react']
                }
            }
        ]
    },
    watchOptions: {
        ignored: [
		    path.resolve(__dirname, 'scripts'),
            path.resolve(__dirname, 'build'),
            path.resolve(__dirname, 'docs'),
            path.resolve(__dirname, 'node_modules')
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new UglifyJSPlugin({
            uglifyOptions: {
                warnings: false,
                parse: {},
                compress: {},
                mangle: true, // Note `mangle.properties` is `false` by default.
                output: null,
                toplevel: false,
                nameCache: null,
                ie8: false,
                keep_fnames: false
            },
            sourceMap: true
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new ExtractTextPlugin({
            filename: 'style.css',
            allChunks: true
        })
    ],
    devtool: isProd ? '' : 'source-map'
};

