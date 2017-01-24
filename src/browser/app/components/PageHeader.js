// @flow
import Box from './Box';
import Heading from './Heading';
import Paragraph from './Paragraph';
import Image from './Image';
import Button from './Button';
import Link from './Link';
import Text from './Text';
import MessageUsButton from './MessageUsButton';
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
    <Box
      display="flex"
      justifyContent="space-between"
      flexWrap="wrap"
    >
      <Box>
        <Heading size={2} marginBottom={0}>{heading}</Heading>
        {description &&
         <Paragraph
           marginBottom={0}
           maxWidth={28}
         >{description}</Paragraph>
        }
      </Box>
      <Box
        display="flex"
        flexDirection="column"
      >
        <Text marginTop={2} bold>Report Queues</Text>
        <Box>
          <MessageUsButton color="white" size="large"/>
        </Box>
      </Box>
    </Box>
  </Box>
);

export default PageHeader;
