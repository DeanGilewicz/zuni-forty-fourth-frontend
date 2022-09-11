module.exports = {
  devServer: {
    proxy: "http://localhost:5555",
  },
  css: {
    loaderOptions: {
      // pass options to sass-loader
      sass: {
        // @/ is an alias to src/
        additionalData: `
					@import "@/styles/globals/normalize.scss";
					@import "@/styles/globals/base.scss";
				`,
      },
    },
  },
};
