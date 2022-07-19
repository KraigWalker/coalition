import { renderToPipeableStream } from 'react-dom/server';

import { App } from '../client/main/App.jsx';
import { MainTemplate } from '../templates/MainTemplate.jsx';
// import getScripts from '../utils/getScripts.js';

const ABORT_DELAY = 10000;

export function serveMainPage(req, res) {
  let didError = false;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.set(
    'Cache-Control',
    'private, no-cache, no-store, must-revalidate, max-age=0'
  );

  const { pipe, abort } = renderToPipeableStream(
    MainTemplate({ children: App() }),
    {
      onShellReady() {
        // The content above all Suspense boundaries is ready.
        // If something errored before we started streaming, we set the error code appropriately.
        res.statusCode = didError ? 500 : 200;
        pipe(res);
      },

      onShellError(error) {
        // Something errored before we could complete the shell so we emit an alternative shell.
        res.statusCode = 500;
        res.send(
          '<!DOCTYPE html><html lang="en"><head><title>MFPKG</title><meta charset="utf-8" />"</head><body><p>Loading...</p></body></html>'
        );
      },
      //onAllReady() {
      // If you don't want streaming, use this instead of onShellReady.
      // This will fire after the entire page content is ready.
      // You can use this for crawlers or static generation.
      // res.statusCode = didError ? 500 : 200;
      // res.setHeader('Content-type', 'text/html');
      // stream.pipe(res);
      //},
      onError(err) {
        didError = true;
        console.error(err);
      },
    }
  );

  // Abandon and switch to client rendering if enough time passes.
  setTimeout(abort, ABORT_DELAY);

  //const elements = getScripts('main', 'iife', globalURLs);
}
