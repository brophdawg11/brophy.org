import { Link, Outlet } from 'remix';

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
