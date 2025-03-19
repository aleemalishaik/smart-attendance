/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/*eslint-disable*/

// reactstrap components
import { Row, Col} from "reactstrap";

const Footer = () => {
  return (
    <footer className="footer">
      <Row className="align-items-center justify-content-xl-right">

        <Col xl="6">
          <div className="copyright text-center text-xl-right text-muted">
            <a
              className="font-weight-bold ml-1"
              href=""
              rel="noopener noreferrer"
              target="_blank"
            >
            </a>
          </div>
        </Col>
        <Col xl="6">
          <div className="copyright text-center text-xl-right text-muted">
            © {new Date().getFullYear()}{" "}
            <a
              className="font-weight-bold ml-1"
              href="https://in.linkedin.com/in/shaik-aleem-ali-bb8495260"
              rel="noopener noreferrer"
              target="_blank"
            >
              SHAIK ALEEM ALI (101122861075)
            </a>
          </div>
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;
