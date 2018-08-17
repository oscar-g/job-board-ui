module.exports = {
  chainWebpack: config => {
    config.resolve.alias.set('joi', 'joi-browser')
  },
};
