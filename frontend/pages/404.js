import React from "react";

const Error = () => {
  return (
    <div className="d-flex flex-column h-100 align-center justify-center position-relative">
      <div className="error-box">
        <div className="inner-box">
          <h1 className="error-code">404</h1>
          <div className="error-text">page not found.</div>
        </div>
      </div>
    </div>
  );
};

export default Error;
