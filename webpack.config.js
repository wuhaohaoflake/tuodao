var webpack = require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path')


var publicPath = 'http://localhost:3000/';
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';


var getHtmlConfig = function(name){
    return {
        template:'./src/view/'+ name +'.html',
            filename:'view/'+ name +'.html',
            inject:true,
            hash:true,
            chunks:['common',name]
    }
}

var config = {
     entry: {
        'common': ['./src/page/common/index.js',hotMiddlewareScript],
        'index': ['./src/page/index/index.js',hotMiddlewareScript],
        'login': ['./src/page/login/index.js',hotMiddlewareScript]
     },
     output: {
         path:path.resolve('./dist'),
         publicPath: '/dist',
         filename: 'js/[name].js'
     },
     externals: {
        'jquery':'window.jQuery'
     },
    module:{
        loaders: [
            {test: /\.css$/,loader: ExtractTextPlugin.extract("style-loader","css-loader")},
            {test: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/,loader: 'url-loader?limit=100&name=resource/[name].[ext]'}
        ]
    },
     plugins:[
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: 'js/base.js'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name:'common',
            filename: 'js/base.js'
        }),
        new ExtractTextPlugin("css/[name].css"),
     	new webpack.optimize.OccurenceOrderPlugin(),
    	new webpack.HotModuleReplacementPlugin(),
    	new webpack.NoErrorsPlugin(),
        new HtmlWebpackPlugin(getHtmlConfig('index')),
        new HtmlWebpackPlugin(getHtmlConfig('login'))
     ]
 };

 module.exports = config;