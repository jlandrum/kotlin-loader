# Kotlin Loader
A basic Kotlin loader for WebPack that invokes `kotlinc-js`

# Usage with Vue
To use with vue, add the following to your `vue.config.js`:
```
configureWebpack: {
	module: {
		rules: [
			{
				test: /\.kt$/,
				use: 'kotlin-loader'
			}
		]
	}
}
```

Scripts marked `lang='kt'` will compile as JavaScript modules.
To set the export, use `val export = (what you want to export)`

