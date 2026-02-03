import NavBar from "../components/navBar";
import { Sidebar } from "../components/sidebar";
import { Footer } from "../components/footer";
import React, { useState } from "react";
import "./contact.css";

function Contact() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-100">
      <NavBar onMenuToggle={handleMenuToggle} />
      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

      <main className="contact-page">
        <div className="contact-container">
          <h1 className="contact-title">Neem contact met ons op</h1>

        <div classname="contact-info-section">
          <div className="contact-grid">
            {/* Contact Info Column */}
            <div className="contact-info">
              <h2 className="contact-subtitle">Contactgegevens</h2>
              {[
                ["Tel.nr.Studio", "0800-1122 (gratis)"],
                ["E-mail", "info@radio2.nl"],
                ["Twitter", "twitter.com/NPORadio2"],
                ["Facebook", "Facebook.com/top2000"],
              ].map(([label, value], index) => (
                <p key={index} className="contact-text">
                  <strong>{label}</strong>: {value}
                </p>
              ))}
            </div>

            {/* Address Column */}
            <div className="contact-info">
              <h2 className="contact-subtitle">Adres</h2>
              <p className="contact-text contact-address">
                <strong>Postadres</strong>:<br />
                Postbus 2644<br />
                1217 ZL Hilversum
              </p>

              <p className="contact-text">
                <strong>Bezoekadres</strong>:<br />
                Bert de Graaffweg 2
              </p>
            </div>

            {/* Address Map */}
            <div className="contact-map">
              <iframe
                src="https://www.google.com/maps?q=Bert%20de%20Graaffweg%202%20Hilversum&output=embed"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Adres locatie"
              />
            </div>
          </div>
        </div>
          {/* Email Button */}
          <div className="contact-email">
            <a href="mailto:info@radio2.nl" className="email-button">
              Stuur ons een e-mail
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Contact;
