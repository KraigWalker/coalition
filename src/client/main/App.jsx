import { Suspense, lazy } from 'react';
import { Loading } from './Loading.jsx';

const Dynamic = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import('./Dynamic.jsx')), 3000);
  });
});

function App() {
  return (
    <>
      <h1>React MFPKG</h1>
      <div>
        <Suspense fallback={<Loading />}>
          <Dynamic />
        </Suspense>
      </div>
    </>
  );
}

export { App };
