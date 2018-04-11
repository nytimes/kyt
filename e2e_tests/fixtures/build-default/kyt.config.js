module.exports = { 
	modifyWebpackConfig: (config, options) => {
		if (options.type === 'client') {
			config.optimization.splitChunks.minSize = 10;
			config.optimization.splitChunks.minChunks = 1;
		}
		return config;
	}
};
