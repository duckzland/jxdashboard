/**
 * Webpack 4 configuration file
 */
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const webpack = require('webpack');
const isProd = (process.env.NODE_ENV === 'production') || (process.env.JX_DEV === "production");


module.exports = {
    entry: './app/index.js',
    mode: isProd ? 'production' : 'development',
    output: {
        path: __dirname + '/dist',
        filename: 'build.js'
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {}
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
                test: /\.js?$/,
                exclude: [
                    path.resolve(__dirname, 'scripts'),
                    path.resolve(__dirname, 'docs'),
                    path.resolve(__dirname, 'build'),
                    path.resolve(__dirname, 'node_modules')
                ],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [ '@babel/preset-env']
                    }
                }
            }
        ]
    },
    plugins: [
        new LodashModuleReplacementPlugin,
        new MiniCssExtractPlugin({
            filename: 'style.css'
        }),
    ],
    watchOptions: {
        ignored: [
		    path.resolve(__dirname, 'scripts'),
            path.resolve(__dirname, 'build'),
            path.resolve(__dirname, 'docs'),
            path.resolve(__dirname, 'node_modules')
        ]
    },
    devtool: 'source-map'
};
