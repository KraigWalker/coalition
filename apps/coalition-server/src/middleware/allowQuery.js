import { createSearch } from '../utils/createSearch.js';

export function allowQuery(validKeys = []) {
  if (!Array.isArray(validKeys)) {
    validKeys = [validKeys];
  }

  return (req, res, next) => {
    const keys = Object.keys(req.query);

    if (!keys.every((key) => validKeys.includes(key))) {
      const newQuery = keys
        .filter((key) => validKeys.includes(key))
        .reduce((query, key) => {
          query[key] = req.query[key];
          return query;
        }, {});

      return res.redirect(302, req.baseUrl + req.path + createSearch(newQuery));
    }

    next();
  };
}
