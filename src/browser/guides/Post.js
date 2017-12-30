// @flow
import React from 'react';
import {
  Box,
  Heading,
  Text,
  Paragraph,
} from '../app/components';

type Props = {
  blogEntry: {
    date: string,
    content: string,
  }
}

const Post = ({ blogEntry }: Props) => (
  <Box marginTop={3}>
    <Heading paddingLeft={2} size={1}>
      { blogEntry.date }
    </Heading>
    <Text>
      {blogEntry.content.split('\n').map((part, key) => (
        <Paragraph
          marginLeft={1}
          color="white"
          key={key}
        >
          {part}
        </Paragraph>
      ))
      }
    </Text>
  </Box>
);

export default Post;
