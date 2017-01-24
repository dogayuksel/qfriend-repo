// @flow
import Box from './Box';
import Heading from './Heading';
import Paragraph from './Paragraph';
import Image from './Image';
import Button from './Button';
import Link from './Link';
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
      alignItems="flex-end"
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
      <Box>
      <Button primary>
        <Link bold color="black" to="https://m.me/qfriendberlin">
          Report Queue
        </Link>
      </Button>
      </Box>
    </Box>
  </Box>
);

export default PageHeader;
