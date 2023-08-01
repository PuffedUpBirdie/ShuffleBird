import React from "react";
import Logo from "../logo.png";

export function Header() {
  return (
    <header>
      <h1
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src={Logo}
          style={{
            height: "2.2rem",
            borderRadius: "6px",
            marginRight: "8px",
          }} />
        <div>
          <div>ShuffleBird</div>
          <div
            style={{
              fontSize: ".3em",
              textAlign: "right",
              marginTop: "-3px",
            }}
          >
            Random Image for Artists
          </div>
        </div>
      </h1>
    </header>
  );
}
