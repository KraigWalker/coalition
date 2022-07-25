import { Suspense, lazy } from 'react';
import { Loading } from './Loading.jsx';

const Dynamic = lazy(() => {
  return new Promise((resolve) => {
    process.env.IS_SERVER
      ? setTimeout(() => resolve(import('./Dynamic.jsx')), 3000)
      : resolve(import('./Dynamic.jsx'));
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
