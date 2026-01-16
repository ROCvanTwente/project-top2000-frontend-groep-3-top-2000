import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import "../components/faq.css";
import ArrowIcon from "../assets/arrow.svg";


function Faq() {
    const [open, setOpen] = useState(false);

  return (
    <div className="faq-item">
      <button className="faq-question" onClick={() => setOpen(!open)}>
        {/* Question text */}
        {/* <span>What is this?</span> */}

        {/* Arrow SVG */}
        <svg
          className={`faq-arrow ${open ? "open" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="24"
          viewBox="0 0 24 24"
          fill="#000000"
        >
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
        </svg>
      </button>

      {/* Answer */}
      {open && (
        <p className="faq-answer">
          This is a dropdown answer with some detailed information
        </p>
      )}
    </div>
  );
}

export default Faq;
