import "./FAQ.css";
import Faq from "../components/faq.jsx";
import NavBar from "../components/navBar";
import { Sidebar } from "../components/sidebar";
import { Footer } from "../components/footer";
import React, { useState} from "react";

function FAQ() {
  // useState voor open/closed state
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

      <main className="faq-content">
        <h1 className="faq-title">Frequently Asked Questions</h1>
        {/* FAQ dropdown */}
        <Faq
          question="What is the top 2000?"
          answer="the top 2000 is a music event which ranks the 2000 most popular songs as voted by the public."
        />
        <Faq
          question="When will the Top 2000 be broadcast?"
          answer="The Top 2000 is broadcast every year from December 25th to December 31st, 24 hours a day."
        />
        <Faq
          question="Who decides which songs are in the Top 2000?"
          answer="The list is determined entirely by the public. Everyone can submit their favorite songs during voting week."
        />
        <Faq
          question="How can I vote for the Top 2000?"
          answer="Voting is possible online via the NPO Radio 2 website during the official voting period, usually in early December."
        />
        <Faq
          question="Can I choose any song I want?"
          answer="Yes, you can submit almost any song, as long as it's officially released. You can choose from a list of suggestions or add your own."
        />
        <Faq
          question="Which song is number 1 most often?"
          answer="Queen's Bohemian Rhapsody has been at number 1 most times in the history of the Top 2000."
        />
        <Faq
          question="Can I also listen to the Top 2000 online or via an app?"
          answer="Yes, the Top 2000 can be heard via NPO Radio 2, the NPO Luister app and via various online streams."
        />
        <Faq
          question="Does the Top 2000 also exist as a list after the event?"
          answer="Yes, after the broadcast, the full list can be found online, including statistics, artist overviews, and dates."
        />
      </main>
      <Footer />
    </div>
  );
}

export default FAQ;
