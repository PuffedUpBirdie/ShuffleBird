import Logo from "../logo.png";

export function Header() {
  return (
    <header>
      <h1
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "0",
          marginBottom: "2rem"
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
            Random Image Viewer for Artists
          </div>
        </div>
      </h1>
    </header>
  );
}
