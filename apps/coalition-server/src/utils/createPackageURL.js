import { createSearch } from './createSearch.js';

export function createPackageURL(packageName, packageVersion, filename, query) {
  return `/${packageName}${packageVersion ? `@${packageVersion}` : ''}${
    filename ? filename : ''
  }${query ? createSearch(query) : ''}`;
}
