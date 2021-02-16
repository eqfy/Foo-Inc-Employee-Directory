import { Link } from "react-router-dom";
import { connect } from "react-redux";

function Header(props) {
  // See React router for more info about headers
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Search Home</Link>
        </li>
        <li>
          <Link to="/profile">Profile View</Link>
        </li>
        <li>
          <Link to="/orgchart">Org Chart</Link>
        </li>
      </ul>
    </nav>
  );
}

export default connect()(Header);
