/* @flow */

/*
  Styling
    - jxnblk.com/writing/posts/patterns-for-style-composition-in-react
    - medium.com/@yoniweisbrod/a-mini-course-on-react-native-flexbox-2832a1ccc6
    - Default rebass theme: github.com/jxnblk/rebass/blob/master/src/config.js
*/

const typography = {
  // www.smashingmagazine.com/2015/11/using-system-ui-fonts-practical-guide
  fontFamily: '"Avenir Next", Helvetica, sans-serif',
  monospace: '"Roboto Mono", Menlo, Consolas, monospace',
  fontSizes: [46, 30, 22, 18, 14, 12, 10],
  lineHeight: 1.4,
  bold: 600,
  scale: [0, 8, 16, 32, 64], // rhythm
};

const colors = {
  primary: '#ffdd18',
  secondary: '#0084ff',
  info: '#2ecc71',
  success: '#0f8',
  warning: '#b92b27',
  error: '#f04',
  // only grayscale
  black: '#111',
  gray: '#333333',
  white: '#fff',
};

const borders = {
  borderRadius: 5,
  borderColor: `rgba(255, 255, 255, ${2/16})`,
};

const inverted = '#222';

const zIndex = [0, 2, 4, 8, 16];

const states = {
  disabled: { cursor: 'default', opacity: 0.5 },
};

const theme = {
  ...typography,
  colors,
  ...borders,
  inverted,
  zIndex,
  states,
};

export const compute = (theme: Object) => ({
  ...theme,
  link: {
    color: theme.colors.primary,
    bold: { fontWeight: theme.bold },
    link: { textDecoration: 'none' },
    hover: { textDecoration: 'underline' },
    active: { textDecoration: 'underline' },
  },
  Container: {
    backgroundColor: theme.colors.black,
    color: theme.colors.white, // inherited
    fontFamily: theme.fontFamily, // inherited
    fontSize: theme.fontSizes[4], // inherited
    lineHeight: theme.lineHeight, // inherited
  },
  Panel: {
    borderWidth: 2,
    backgroundColor: theme.colors.black,
  },
  Toolbar: {
    marginTop: theme.scale[2],
    padding: theme.scale[2],
  },
});

export default compute(theme);
