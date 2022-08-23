import React from "react";
import "./footer.scss";

function Footer() {

  return (
    <div className="app-footer">
      <div className="footer-content-container">
        <div className='check-us'>Check us on</div>
        <div className='link-badges-container'>
          <div className='clickable-icon'>

          </div>
          <div className='clickable-icon'>

          </div>
          <div className='clickable-icon'>
            {/*<img src='/src/assets/tau-logo-blue.jpeg'/>*/}
          </div>
        </div>
        <div>
          <a href="https://he.wikipedia.org/wiki/%D7%99%D7%95%D7%A8%D7%9D_%D7%A8%D7%99%D7%99%D7%9A" className='link-text' target="_blank">Yoram Reich</a>
          <a href="https://cris.tau.ac.il/en/publications/designing-psi-an-introduction-to-the-psi-framework" className='link-text' target="_blank">About psi</a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
