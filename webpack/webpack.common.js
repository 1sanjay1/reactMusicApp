const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const dynamicRoutesConfig = require('./../src/app/root/dynamicRoutesPaths.js');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// var ManifestPlugin = require('webpack-manifest-plugin');
// const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    /**
     * [filename Name of the result file. May contain [name], [id] and [contenthash]]
     * @type {String}
     */
    filename: './c/[name].[chunkhash].css',
    /**
     * [allChunks Extract from all additional chunks too
     *  (by default it extracts only from the initial chunk(s)) When using
     *  CommonsChunkPlugin and there are extracted chunks
     *  (from ExtractTextPlugin.extract) in the commons chunk, allChunks
     *  must be set to true]
     * @type {Boolean}
     */
    allChunks: true,
    disable: process.env.NODE_ENV === "development"
});

module.exports = {
    entry: {
        // external: path.resolve(__dirname, './../src/app/vendor/external/index.js'),
        // internal: path.resolve(__dirname, './../src/app/vendor/internal/index.js'),
        app: path.resolve(__dirname, './../src/app/index.js')
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader"
        }, {
            test: /\.scss$/,
            use: extractSass.extract({
                use: [{
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                }, {
                    loader: "postcss-loader", // for autoprefixer
                    options: {
                        plugins: function () {
                            return [
                                new Autoprefixer({
                                    browsers: ['last 2 versions', '> 5%']
                                })
                            ];
                        }
                    }
                }]
            })
        }, {
            test: /\.svg$/,
            loader: 'svg-inline-loader'
        }, {
            test: /\.font\.js/,
            loader: ExtractTextPlugin.extract({
                use: [
                    'css-loader',
                    'webfonts-loader'
                ]
            })
        }]
    },
    optimization:{
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: "vendor",
                    chunks: "initial",
                    minChunks: 2
                }
            }
        }
    },
    plugins: [
        extractSass,
        new HtmlWebpackPlugin({
            title: "test template",
            template: "./src/index.html",
            fileName: "./../../index.html", // not working need to check,
            /**
             * [chunksSortMode description]
             * @param  {[type]} chunk1 [description]
             * @param  {[type]} chunk2 [description]
             * @return {[type]}        [description]
             */
            chunksSortMode: function(chunk1, chunk2) {
                var order = ['runtime', 'vendor', 'external', 'internal', 'app'];
                var order1 = order.indexOf(chunk1.names[0]);
                var order2 = order.indexOf(chunk2.names[0]);
                return order1 - order2;
            },
            // inject: 'body',
            // excludeChunks: ['tracking', 'text']
            // hash: true,
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            jquery: 'jquery'
        }),
        // new BundleAnalyzerPlugin()
    ],
    resolve: {
        /**
         * [alias Alias for dynamic chucks]
         * @type {[type]}
         */
        // alias: dynamicRoutesConfig
    }
};
