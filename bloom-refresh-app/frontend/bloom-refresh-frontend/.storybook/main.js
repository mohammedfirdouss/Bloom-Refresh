module.exports = {
  stories: [
    '../src/components/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions'
  ],
  framework: {
    name: '@storybook/react',
    options: {}
  },
  docs: {
    autodocs: 'tag',
  },
}; 