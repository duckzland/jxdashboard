  
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

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
                test: /\.(png|jpg|eot|)$/,
                loaders: ['file-loader']
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
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
                test: /\.(svg)$/,
                loaders: ['svg-url-loader']
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
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new ExtractTextPlugin({
            filename: 'style.css',
            allChunks: true
        })
    ],
    devtool: 'source-map'
};

