import React from "react";

export const Footer = () => {
  return (
    <footer
      className="container-fluid"
      style={{
        backgroundColor: "var(--secondary)",
        color: "var(--text-color)",
        padding: "1rem 0", // Reduced from 2rem to 1rem (50% reduction)
      }}
    >
      <div className="row mx-0">
        <div className="col-md-4 col-sm-12 d-flex justify-content-center align-items-center">
          <img
            src="/top-2000-logo-empty.png"
            alt="top2000 logo"
            className="img-fluid"
            style={{ maxHeight: "100px" }} // Reduced from 200px to 100px (50% reduction)
          />
        </div>
        <div className="col-12 mt-3 mb-2">
          {" "}
          {/* Added margin top/bottom */}
          <h5 style={{ color: "var(--text-color)" }}>Contact</h5>{" "}
          {/* Changed from h3 to h5 */}
          <p
            className="mb-2"
            style={{
              color: "var(--text-color)",
              fontSize: "0.9rem", // Slightly smaller text
            }}
          >
            Bekijk hieronder alle contactgegevens
          </p>
        </div>
        <div className="col-md-4 col-sm-12">
          <div className="contact-info">
              {[
              ["Tel.nr. Studio", "0800-1122 (gratis)"],
              ["E-mail", "info@radio2.nl"],
              ["Twitter", "twitter.com/NPORadio2"],
              ["Facebook", "Facebook.com/top2000"],
            ].map(([label, value], index) => (
              <p
                key={index}
                className="mb-1" // Reduced margin between lines
                style={{
                  color: "var(--text-color)",
                  fontSize: "0.9rem", // Slightly smaller text
                }}
              >
                <strong>{label}</strong>: {value}
              </p>
            ))}
          </div>
        </div>
        <div className="d-none d-md-block col-md-1">
          <div
            style={{
              borderLeft: "1px solid white", // Thinner border (from 2px to 1px)
              height: "80%", // Slightly shorter
              margin: "0.5rem 0", // Added margin
            }}
          ></div>
        </div>
        <div className="col-md-4 col-sm-12">
          <div className="contact-info">
            <p
              className="mb-1"
              style={{
                color: "var(--text-color)",
                fontSize: "0.9rem",
              }}
            >
              <strong>Adress</strong>:
            </p>
            <p
              className="mb-1"
              style={{
                color: "var(--text-color)",
                fontSize: "0.9rem",
              }}
            >
              Postbus2644
              <br />
              1217ZL Hilversum
            </p>
            <p
              className="mb-1"
              style={{
                color: "var(--text-color)",
                fontSize: "0.9rem",
              }}
            >
              <strong>Bezoekadres</strong>: Bert de graaffweg2
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
