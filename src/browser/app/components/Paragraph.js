// @flow
import type { Strict, Styled } from '../themes/types';
import type { TextProps } from './Text';
import Text from './Text';
import styled from './styled';

const Paragraph: Styled<TextProps> = styled((theme, {
  display = 'block',
  marginBottom = theme.paragraph.marginBottom,
  marginRight = theme.paragraph.marginRight,
  maxWidth = theme.block.maxWidth,
}) => ({
  $extends: [Text, ({
    display,
    marginBottom,
    marginRight,
    maxWidth,
  }: Strict<TextProps>)],
}));

export default Paragraph;
