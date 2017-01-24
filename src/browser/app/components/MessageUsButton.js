// @flow
import React from 'react';

type MessageUsButtonProps = {
  color:"blue"|"white",
  size:"standard"|"large"|"xlarge",
};

const MessageUsButton = (props: MessageUsButtonProps) =>
  <div
    is
    class="fb-messengermessageus" 
    messenger_app_id="1000515043403983" 
    page_id="488188174710294"
    color={props.color}
    size={props.size}
  >
  </div>;

export default MessageUsButton;
