# kyt Recipes
Easy ways to extend kyt


## Add webpack alises
in kyt.config.js

```
modifyWebpackConfig: (baseConfig, options) => {
  baseConfig.resolve.alias = {
    'myAliasFolder': path.resolve(process.cwd(), './src/path/to/my/folder'),
  }
  return baseConfig;
}
```

## Add PostCSS Plugins
in kyt.config.js
```   
modifyWebpackConfig: (baseConfig, options) => { 
baseConfig.postcss = (bundler) => {
      return [
        require('postcss-import')({ addDependencyTo: bundler }),
        require('precss')(),
        require('autoprefixer')({ browsers: myListOfBrowsers }),
      ]
    };
    return baseConfig;
}
```    

## Add Babel Plugin
in kyt.config.js
```
modifyWebpackConfig: (baseConfig, options) => {

  const babelLoader = baseConfig.module.loaders.find(loader => loader.loader === 'babel-loader');
  babelLoader.query.plugins.push(path.resolve('./path/to/my/plugin'));
  
  return baseConfig;
}
```

## Add Babel Presets

