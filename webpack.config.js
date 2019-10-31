/**
 * This file was created by Sudipta Deb (sudi-3385) on 19/07/18.
 */
let path = require('path');  //NO I18N

const HtmlWebPackPlugin = require("html-webpack-plugin");//No I18N
const MiniCssExtractPlugin = require("mini-css-extract-plugin");//No I18N
const VueLoaderPlugin = require("vue-loader/lib/plugin");//No I18N
const TerserJsPlugin = require('terser-webpack-plugin'); //No I18N

const devMode = process.env.NODE_ENV !== 'production'; //No I18N


function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    devtool: devMode ? 'inline-source-map' : false, //No I18N
    entry: {
        dashboard: __dirname + "/src/main.js", //No I18N
        warmap: __dirname + "/src/map/warmapapp.js", //No I18N
    },
    output: {
        path: __dirname + '/dist', // Folder to store generated bundle //NO I18N
        filename: 'assets/js/[name].[hash].js',  // Name of generated bundle after build //NO I18N
        chunkFilename: 'assets/js/[name].[hash].js' //NO I18N
        //publicPath: null // public URL of the output directory when referenced in a browser
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',//NO I18N
            '@': resolve('src')  //NO I18N
        },
        extensions: ['*', '.js', '.vue'] //NO I18N
    },
    module: {
        rules: [
            {
                test: /ServiceWorker\.js$/,
                use: [{
                    loader: 'file-loader',  //NO I18N
                    options: {
                        name:'[name].[ext]', //NO I18N
                        outputPath: './' //NO I18N
                    }
                }]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader" //NO I18N
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader", //NO I18N
                        options: {minimize: false}
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../../' // because in the Css Extract plugin filename has two directories assets/css/ //NO I18N
                        }
                    },
                    {
                        loader: "css-loader" //NO I18N
                    }

                ]
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../../' // because in the Css Extract plugin filename has two directories assets/css/ //NO I18N
                        }
                    },
                    {
                        loader: "css-loader" //No I18N
                    }, {
                        loader: "sass-loader" //No I18N
                    }

                ]
            },
            {
                test: /\.(ico|png|jpe?g|gif|webp)(\?.*)?$/,
                loader: 'url-loader',  //NO I18N
                options: {
                    limit: 10000,
                    name: 'assets/img/[name].[hash:7].[ext]'  //NO I18N
                }
            },
            {
                test: /\.(woff(2)?|ttf|eot|otf|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader', //NO I18N
                    options: {
                        name: '[name].[ext]', //NO I18N
                        outputPath: 'assets/fonts/' //NO I18N
                    }
                }]
            },
            {
                type: "javascript/auto", //NO I18N
                test: /\.json$/,
                use: [{
                    loader: 'file-loader', //NO I18N
                    options: {
                        name: '[name].[ext]', //NO I18N
                        outputPath: 'assets/data/' //NO I18N
                    }
                }]
            },
            {
                test: /\.vue$/,
                use: [{
                    loader: 'vue-loader' //NO I18N
                }]
            }
        ]
    },
    optimization: {
        minimizer: [
            // we specify a custom UglifyJsPlugin here to get source maps in production
            new TerserJsPlugin({
                cache: true,
                parallel: true,
                terserOptions: {
                    ecma: 6,
                    warnings: false,
                    parse: {},
                    compress: {},
                    mangle: true, // Note `mangle.properties` is `false` by default.
                    module: false,
                    output: null,
                    toplevel: false,
                    nameCache: null,
                    ie8: false,
                    keep_classnames: undefined,
                    keep_fnames: false,
                    safari10: false
                },
                sourceMap: false
            })
        ],
        splitChunks: {
            chunks: 'async',//NO I18N
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '-' //NO I18N
        }
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",//NO I18N
            filename: "./index.html",//NO I18N
            chunks: ["dashboard"], //NO I18N
            favicon: "./src//assets/img/favicon.ico" //NO I18N
        }),
        new HtmlWebPackPlugin({
            template: "./src/warmap.html",//NO I18N
            filename: "./warmap.html",//NO I18N
            chunks: ["warmap"], //NO I18N
            favicon: "./src//assets/img/favicon.ico" //NO I18N
        }),
        new HtmlWebPackPlugin({
            template: "./src/break.html",//NO I18N
            filename: "./break.html",//NO I18N
            favicon: "./src//assets/img/favicon.ico" //NO I18N
        }),
        new MiniCssExtractPlugin({
            filename: "assets/css/[name].[hash].css",//NO I18N
            chunkFilename: "assets/css/[name].[hash].css"//NO I18N
        }),
        //(devMode ? new BundleAnalyzerPlugin():null),
        new VueLoaderPlugin()
    ],
    devServer: {
        proxy: {
            '/': 'ht' + 'tp://localhost:8080' //No I18N
        },
        port: 8082,
        host: '0.0.0.0',
        disableHostCheck: true
    }
};
