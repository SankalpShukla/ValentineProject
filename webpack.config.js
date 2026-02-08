const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, 'src', 'index.js'),
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.m?jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            // prevent css-loader from resolving/rewriting url(...) paths
                            url: false
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg|mp3)$/,
                type: 'asset/resource'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'public')
        },
        port: 8080,
        hot: true,
        open: false,
        historyApiFallback: true
    },
    devtool: 'eval-source-map'
    ,
    plugins: [
        new CopyWebpackPlugin({ patterns: [ { from: path.resolve(__dirname, 'public'), to: path.resolve(__dirname, 'dist') } ] })
    ]
};