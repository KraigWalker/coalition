import cors from 'cors';
import express from 'express';
import { serveMainPage } from './actions/serveMainPage.js';
import { noQuery } from './middleware/noQuery.js';
import { allowQuery } from './middleware/allowQuery.js';
import { validatePackageName } from './middleware/validatePackageName.js';
import { validatePackagePathname } from './middleware/validatePackagePathname.js';

/**
 *
 * @param {Function} callback
 * @returns An express server instance
 */
function createApp(callback) {
  const app = express();
  callback(app);
  return app;
}

export function createServer() {
  return createApp((app) => {
    app.use(cors());
    app.use('/client', express.static('build/client'));

    /**
     * Serves the main homepage.
     */
    app.get('/', serveMainPage);

    /**
     * Displays the source code of the module within a syntax-highlighted view.
     */
    app.use(
      '/browse',
      createApp((app) => {
        app.enable('strict routing');

        app.get(
          '*/',
          noQuery(),
          validatePackagePathname,
          validatePackageName,
          validatePackageVersion,
          serveDirectoryBrowser
        );

        app.get(
          '*',
          noQuery(),
          validatePackageName,
          validatePackageName,
          validatePackageVersion,
          serveDirectoryBrowser
        );
      })
    );

    /**
     * Serves metadata about the package entry point that is resolved.
     * Path, type, contentType, integrity, lastModified, size.
     * @example https://unpkg.com/react@16.7.0/index.js?meta
     * @example https://unpkg.com/react@16.7.0/index.js?meta=true
     */
    const metadataApp = createApp((app) => {
      app.enable('strict routing');

      app.get(
        '*/',
        allowQuery('meta'),
        validatePackagePathname,
        validatePackageName,
        validatePackageVersion,
        validateFilename,
        serveDirectoryMetadata
      );

      app.get(
        '*',
        allowQuery('meta'),
        validatePackagePathname,
        validatePackageName,
        validatePackageVersion,
        validateFilename,
        serveDirectoryMetadata
      );
    });

    app.use((req, res, next) => {
      if (req.query.meta != null) {
        metadataApp(req, res);
      } else {
        next();
      }
    });

    /**
     * @todo Serve modules
     */

    /**
     * Serve files
     */
    app.get(
      '*',
      noQuery(),
      validatePackagePathname,
      validatePackageName,
      validatePackageVersion,
      validateFilename,
      findEntry,
      serveFile
    );
  });
}
