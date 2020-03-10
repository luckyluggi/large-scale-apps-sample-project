const path = require('path');
const WebpackPluginMockSocketServer = require('./zsocket-mocks/WebpackPluginMockSocketServer.js');

module.exports = {
	devServer: {
		port: 8082
	},
	// pluginOptions: {
	// 	i18n: {
	// 		locale: 'en',
	// 		fallbackLocale: 'en',
	// 		localeDir: 'locales',
	// 		enableInSFC: true
	// 	}
	// },
	productionSourceMap: true,
	outputDir: 'dist',
	/* publicPath is used by npm run build to prefix references for script/css files */
    /*publicPath: process.env.NODE_ENV == 'production' ? './some-prefix/dist/' : './',*/
	publicPath: './',
	/* chainWebpack/configureWebpack so that npm run build does not produce hashed file names under dist/ folder */
	
    chainWebpack: (config) => {
		config.resolve.alias.set('@', path.resolve(__dirname, 'src'))

        if (config.plugins.has('extract-css')) {
            const extractCSSPlugin = config.plugin('extract-css');
            extractCSSPlugin && extractCSSPlugin.tap(() => [{
                filename: '[name].css',
                chunkFilename: '[name].css'
            }])
        }

		if (process.env.NODE_ENV === 'production') {
			// if we need to make exception for some things that should not go into the dist folder
		}
    },
    configureWebpack: {
        output: {
            filename: '[name].js',
            chunkFilename: '[name].js'
        },
		resolve: {
			alias: {
				"@": path.resolve(__dirname, 'src')
			}
		},
		plugins: [
			new WebpackPluginMockSocketServer()
		]
    }

}