const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const Autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const config = require('./src/server/config.js');
const outputDirectory = 'dist';

module.exports = {
		entry: [
				'./src/client/index.js',
				'./src/client/index.less'
		],
		output: {
				path: path.join(__dirname, outputDirectory),
				filename: 'bundle.js'
		},
		module: {
				rules: [
						{
								test: /\.js$/,
								exclude: /node_modules/,
								use: {
										loader: 'babel-loader'
								}
						},
						{
								test: /\.(less|css)$/,
								include: path.resolve(__dirname),
								use: ExtractTextPlugin.extract({
										use: [
												{
														loader: 'css-loader',
														options: {
																minimize: true
														}
												},
												{
														loader: 'postcss-loader',
														options: {
																plugins: [
																		Autoprefixer({
																				browsers: ['ie >= 8', 'last 4 version']
																		})
																],
														}
												},
												'less-loader'
										]
								})
						},
						{
								test: /\.(png|jpg|svg|gif|docx)$/,
								use: [
										{
												loader: 'url-loader',
												options: {
														limit: 8192
												}
										}
								]
						},
						{
								test: /\.(html)$/,
								use: {
										loader: 'html-loader',
										options: {
												attrs: [':data-src', 'img:src', ':data-docx'],
												interpolate: true
										}
								}
						},
						{
								test: /\.(eot|woff|woff2|ttf)$/,
								loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
						}
				]
		},
		devServer: {
				port: 3000,
				open: true,
				contentBase: [ 'src/client/styles' ],
				watchContentBase: true,
				proxy: {
						'/': `http://localhost:${config.port}`
				}
		},
		plugins: [
				new CleanWebpackPlugin([outputDirectory]),
				new FaviconsWebpackPlugin('./src/client/favicon.png'),
				new HtmlWebpackPlugin({
					template: './src/client/index.html',
					favicon: './src/client/favicon.png'
				}),
				new ExtractTextPlugin({
					filename: './main.css',
					allChunks: true,
				}),
		]
};
