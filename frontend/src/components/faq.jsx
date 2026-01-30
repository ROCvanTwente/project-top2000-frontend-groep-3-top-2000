import { useState } from "react";
import "../components/faq.css";

const FaqItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="faq-item">
      <div
        className="faq-question"
        onClick={() => setOpen((o) => !o)}
        role="button"
        aria-expanded={open}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setOpen((o) => !o);
          }
        }}
      >
        <h3>{question}</h3>

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
      </div>

      {open && <div className="faq-answer">{answer}</div>}
    </div>
  );
};

export default FaqItem;