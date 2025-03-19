import React from "react";
import classnames from "classnames";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
// reactstrap components
import {
    NavItem,
    NavLink,
    Nav,
} from "reactstrap";

class Navs extends React.Component {
    state = {
        navPills: 1
    };
    toggleNavs = (e, state, index) => {
        e.preventDefault();
        this.setState({
            [state]: index
        });
    };
    render() {
        return (
            <>
                <Nav
                    className="nav-fill flex-column flex-sm-row"
                    id="tabs-text"
                    pills
                    role="tablist"
                >
                    <NavItem>
                        <NavLink
                            aria-selected={this.state.navPills === 1}
                            className={classnames("mb-sm-3 mb-md-0", {
                                active: this.state.navPills === 1
                            })}
                            // to="/auth/login"  /* Changed href to to */
                            // tag={Link}  /* Use the Link component here */
                            href="/auth/login"
                            target="_blank"
                            role="tab"
                        >
                            Admin Login
                        </NavLink>
                    </NavItem>
                </Nav>
            </>
        );
    }
}

export default Navs;