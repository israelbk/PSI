import React from "react";
import "./footer.scss";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

function Footer() {
  return (
    <div className="app-footer">
      <div className="footer-content-container">
        <div className="check-us">Check us on</div>
        <div className="link-badges-container">
          <div className="clickable-icon">
            <a href="https://www.linkedin.com/school/tel-aviv-university/" target="blank">
              <LinkedInIcon sx={{color: 'white'}}/>
            </a>
          </div>
          <div className="clickable-icon">
            <a href="https://www.facebook.com/tau.main/" target="blank" rel="noreferrer">
              <FacebookIcon sx={{color: 'white'}}/>
            </a>
          </div>
          <div className="clickable-icon">
            <a href="https://www.instagram.com/telavivuni/" target="blank" rel="noreferrer">
              <InstagramIcon sx={{color: 'white'}}/>
            </a>
          </div>
        </div>
        <div>
          <a
            href="https://he.wikipedia.org/wiki/%D7%99%D7%95%D7%A8%D7%9D_%D7%A8%D7%99%D7%99%D7%9A"
            className="link-text"
            target="_blank"
            rel="noreferrer"
          >
            Yoram Reich
          </a>
          <a
            href="https://cris.tau.ac.il/en/publications/designing-psi-an-introduction-to-the-psi-framework"
            className="link-text"
            target="_blank"
            rel="noreferrer"
          >
            About psi
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
