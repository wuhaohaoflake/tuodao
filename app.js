var express = require('express'),
    path = require('path'),
    consolidate = require('consolidate');

var isDev = process.env.NODE_ENV !== 'production';
var app = express();
var port = 3000;

var ejs = require('ejs');
// app.engine('html', ejs.__express);
// app.set('view engine', 'html');
// app.set('views', '192.168.0.151:3000/view');

app.set('views',path.join(__dirname , './src/view') );
app.engine('.html', ejs.__express);  
app.set('view engine', 'html');


app.locals.env = process.env.NODE_ENV || 'dev';
app.locals.reload = true;

if (isDev) {

    var webpack = require('webpack'),
        webpackDevMiddleware = require('webpack-dev-middleware'),
        webpackHotMiddleware = require('webpack-hot-middleware'),
        webpackDevConfig = require('./webpack.config.js');

    var compiler = webpack(webpackDevConfig);

    // attach to the compiler & the server
    app.use(webpackDevMiddleware(compiler, {

        // public path should be the same with webpack config
        publicPath: webpackDevConfig.output.publicPath,
        noInfo: true,
        stats: {
            colors: true
        }
    }));
    app.use(webpackHotMiddleware(compiler));
var birds = require('./src/routes');
app.use('/', birds);
    // require('./src/routes')(app);

    var reload = require('reload');
    var http = require('http');

    var server = http.createServer(app);
    reload(server, app);

    server.listen(port, function(){
        console.log('App (dev) is now running on port 3000!');
    });
} else {


    app.use(express.static(path.join(__dirname, 'public')));
    // require('./src/routes')(app);
    app.listen(port, function () {
        console.log('App (production) is now running on port 3000!');
    });
}
