/* @flow */
/* eslint-disable react/no-danger */
import React from 'react';

type Props = {
  appCssFilename: string,
  bodyCss: string,
  bodyHtml: string,
  helmet: Object,
  isProduction: boolean,
};

const Html = ({
  appCssFilename,
  bodyCss,
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
      <style dangerouslySetInnerHTML={{ __html: bodyCss }} id="stylesheet" />
    </head>
    <body dangerouslySetInnerHTML={{ __html: bodyHtml }} />
  </html>
);

export default Html;
