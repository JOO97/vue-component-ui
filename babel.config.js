module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript'
  ],
  plugins: ['@vue/babel-plugin-jsx'] //支持 Vue 3 JSX 的
}
