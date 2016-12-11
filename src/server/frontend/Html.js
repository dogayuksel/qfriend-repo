/* @flow */
/* eslint-disable react/no-danger */
import React from 'react';

type Props = {
  appCssFilename: string,
  bodyHtml: string,
  helmet: Object,
  isProduction: bool,
};

const Html = ({
  appCssFilename,
  bodyHtml,
  helmet,
  isProduction,
}: Props) => (
  <html {...helmet.htmlAttributes.toComponent()}>
    <head>
      {helmet.title.toComponent()}
      {helmet.base.toComponent()}
      {helmet.meta.toComponent()}
      {helmet.link.toComponent()}
      {helmet.script.toComponent()}
      {appCssFilename &&
        <link href={appCssFilename} rel="stylesheet" />
      }
    </head>
    <body
      dangerouslySetInnerHTML={{ __html: bodyHtml }}
    />
  </html>
);

// TODO: Use babel-plugin-flow-react-proptypes one day.
Html.propTypes = {
  appCssFilename: React.PropTypes.string,
  bodyHtml: React.PropTypes.string.isRequired,
  helmet: React.PropTypes.object.isRequired,
  isProduction: React.PropTypes.bool.isRequired,
};

export default Html;
