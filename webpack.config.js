var htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        main:'./src/app.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: 'js/[name].bundle.js',
    },
    plugins: [
        new htmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject:false,
            minify:{
                collapseWhitespace:true,
                removeComments:true,
                minifyJS:true
            }
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: __dirname + 'node_modules',
                include: __dirname + 'src',
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }]
            },
            {
                test: /\.html$/,
                loader: 'html-withimg-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: [
                                require('autoprefixer')({
                                    broswers: ['last 5 versions']
                                })
                            ]
                        }
                    }]
            },
            {
                test: /\.(jpg|png|gif|svg)$/i,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 8192,
                            name: 'images/[name].[ext]'
                        }
                    },
                    {
                        loader: "image-webpack-loader"
                    }
                ]
            }
        ]
    }
}