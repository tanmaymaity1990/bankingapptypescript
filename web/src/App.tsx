import React from "react";
import AppRoute from "./routes/AppRoute";

function App() {
  return (
    <>
      <div className="wrapper">
        <div className="preloader flex-column justify-content-center align-items-center">
          <img
            className="animation__shake"
            src="/assets/img/AdminLTELogo.png"
            alt="AdminLTELogo"
            height="60"
            width="60"
          />
        </div>
        <AppRoute />
      </div>
    </>
  );
}

export default App;
