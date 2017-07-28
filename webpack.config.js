var webpack = require('webpack');
var path = require('path');
var env=process.env.NODE_ENV;
// 独立打包CSS文件
var ExtractTextPlugin = require("extract-text-webpack-plugin");
// 自动生成HTML
var HtmlWebpackPlugin = require('html-webpack-plugin');

// 获取HTML
var getHtmlConfig = function(name){
	return {
		template    : 'src/view/'+ name +'.html',
		filename    : 'view/'+ name +'.html',
		chunks      : ['common',name]
	};

};

var publicPath = 'http://192.168.0.151:3000/';
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';

var devConfig = {
	entry: {
		'common': ['./src/page/common/index.js',hotMiddlewareScript],
		'index': ['./src/page/index/index.js', hotMiddlewareScript,],
		'login': ['./src/page/login/index.js', hotMiddlewareScript]
	},
	output: {
		filename: 'js/[name].js',
		path: path.resolve(__dirname, './dist'),
		publicPath: publicPath
	},

	module: {
		preLoaders: [{
			test: /\.js$/,
			loader: 'eslint-loader',
			exclude: /node_modules/
		}],
		loaders: [{
			test: /\.css$/,
			loader: ExtractTextPlugin.extract('style-loader','css-loader')
		}]

	},
	plugins: [
		// new webpack.HotModuleReplacementPlugin(),
		// new webpack.NoEmitOnErrorsPlugin()
		new webpack.DefinePlugin({
        	'env': {
        		NODE_ENV: '"+env+"'
        	}
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name : 'common',
			filename : 'js/base.js'
		}),
		new ExtractTextPlugin('css/[name].css'),

		new HtmlWebpackPlugin(getHtmlConfig('index')),
		new HtmlWebpackPlugin(getHtmlConfig('login')),

		// new webpack.optimize.OccurenceOrderPlugin(), 
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()
	]
};

module.exports = devConfig;


