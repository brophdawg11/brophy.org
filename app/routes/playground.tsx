import { Link, Outlet } from 'react-router';

export default function PlaygroundLayout() {
  return (
    <>
      <h1>
        <Link to="/playground">💿 Remix Playground</Link>
      </h1>
      <Outlet />
    </>
  );
}
