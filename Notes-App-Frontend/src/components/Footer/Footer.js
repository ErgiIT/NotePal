import React from "react";
import "./Footer.css";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <div className="footer">
        <p>Copyright ⓒ {year}</p>
        <p>Ergi Aliko</p>
      </div>
    </footer>
  );
}

export default Footer;
