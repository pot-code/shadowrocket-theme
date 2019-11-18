import { configure, addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs'
import { addParameters } from '@storybook/react';

// addon settings
addDecorator(withKnobs);

addParameters({
  backgrounds: [
    { name: 'dark', value: '#222831' },
    { name: 'dawn', value: '#393e46' },
    { name: 'orange', value: '#d65a31' },
    { name: 'gray', value: '#eeeeee' },
    { name: 'pure white', value: '#ffffff', default: true },
  ],
});

// automatically import all files ending in *.stories.js
const req = require.context('../src/components', true, /\.stories\.tsx$/);
function loadStories() {
  req.keys().forEach(req);
}

configure(loadStories, module);
