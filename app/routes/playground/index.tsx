import { Link } from 'remix';

export default function PlaygroundIndex() {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="autocomplete">Autocomplete</Link>
                </li>
            </ul>
        </nav>
    );
}
