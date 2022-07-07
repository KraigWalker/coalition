import cors from 'cors';
import express from 'express';

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
  });
}
