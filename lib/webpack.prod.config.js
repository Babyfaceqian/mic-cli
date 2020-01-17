const merge = require('webpack-merge');
const common = require('./webpack.common.config.js');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(common, {
	mode: 'production',
	// optimization: {
	//   splitChunks: {
	//     chunks: "all",
	//     minSize: 200000,
	//     minChunks: 2,
	//     maxAsyncRequests: 5,
	//     maxInitialRequests: 3,
	//     name: true
	//   }
	// },
	plugins: [
		new CleanWebpackPlugin(),
		// new BundleAnalyzerPlugin()
	],
	optimization: {
		minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({
			cssProcessorOptions: {
			}
		})],
	},
});