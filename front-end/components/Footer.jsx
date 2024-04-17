import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [menu, setMenu] = useState("");

  return (
    <div className="w-full h-25 flex flex-col items-center justify-center bg-thdwhite bg-opacity-15">
      <div className="footerItem font-bold mt-6 mb-0">Quick Links</div>
      <div className="flex flex-row">
        <ul className="navbar flex flex-row items-center text-center">
          <li class="footerItem" onClick={() => setMenu("User")}>
            <Link style={{ textDecoration: "none" }} to={"/user"}>
              • User{menu === "User" ? <hr className="bg-secwhite" /> : <></>}
            </Link>
          </li>
          <li className="footerItem" onClick={() => setMenu("Metrixes")}>
            <Link style={{ textDecoration: "none" }} to={"/metrixes"}>
              • Metrixes{menu === "Metrixes" ? <hr /> : <></>}
            </Link>
          </li>
          <li className="footerItem" onClick={() => setMenu("HPA")}>
            <Link style={{ textDecoration: "none" }} to={"/hpa"}>
              • HPA{menu === "HPA" ? <hr /> : <></>}
            </Link>
          </li>
        </ul>
      </div>
      <div className="footerItem font-sm mt-0 mb-10">
        ©2023 - 2024 OptiKube. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
