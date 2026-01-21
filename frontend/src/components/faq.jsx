import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import "../components/faq.css";
import ArrowIcon from "../assets/arrow.svg";

const FaqItem = ({ question, answer, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="faq-item">
      <div className="faq-question">

      </div>
        <div className="question-box">
          <h3 className="faq-question-text">{question}</h3>
          <button
            className="faq-arrowButton"
            onClick={() => setOpen(open => !open)}
            aria-expanded={open}
          >
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
        </div>

        {open ? (
          <h5 className="faq-answer">
            {answer}
          </h5>
        ) : null}
      </div>
  );
};
export default FaqItem;