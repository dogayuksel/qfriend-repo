// @flow
import Box from './Box';
import Heading from './Heading';
import Paragraph from './Paragraph';
import Image from './Image';
import React from 'react';

type PageHeaderProps = {|
                        heading: string,
                        description?: string,
                       |};

const PageHeader = ({ heading, description }: PageHeaderProps) => (
  <Box
    paddingTop={6}
    paddingBottom={1}
    paddingHorizontal={1}
    backgroundImage={require('./hero-image.png')}
    backgroundSize={'cover'}
    backgroundPosition={'left bottom'}
  >
    <Heading size={2} marginBottom={0}>{heading}</Heading>
    {description &&
     <Paragraph
       marginBottom={0}
       maxWidth={28}
     >{description}</Paragraph>
    }
  </Box>
);

export default PageHeader;
