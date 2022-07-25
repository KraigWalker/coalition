import React from 'react';

export function MainTemplate({
  title = 'MFPKG',
  description = 'Module Federation Gateway',
  // favicon = '/favicon.ico',
  elements = [], // script elements we want to insert into page
  children,
}) {
  return (
    <>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          {/** @todo Need an identifiable favicon 
      // favicon && e('link', { rel: 'shortcut icon', href: favicon }),*/}
          <title>{title}</title>
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1,maximum-scale=1"
          />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
          {description && <meta name="description" content={description} />}
          <meta name="timestamp" content={new Date().toISOString()} />
        </head>
        <body>
          <div id="root">{children}</div>
          <script type="module" src="./client/index.js" />
        </body>
      </html>
    </>
  );
}
