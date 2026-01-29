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
        <h1 className="faq-title">Veel gevraagde vragen</h1>
        {/* FAQ dropdown */}
        <Faq
          question="Wat is de top 2000?"
          answer="De top 2000 is een muziek enevement die de 2000 meest populaire liedjes rangschikt op basis van stemmen door het publiek."
        />
        <Faq
          question="Wanneer wordt de Top 2000 uitgezonden?"
          answer="De Top 2000 wordt elk jaar uitgezonden van 25 december tot en met 31 december, 24 uur per dag."
        />
        <Faq
          question="Wie bepaalt welke nummers in de Top 2000 staan?"
          answer="De lijst wordt volledig bepaald door het publiek. Iedereen kan tijdens de stemweek zijn of haar favoriete nummers insturen."
        />
        <Faq
          question="Hoe kan ik stemmen voor de Top 2000?"
          answer="Stemmen kan online via de website van NPO Radio 2 tijdens de officiële stemperiode, meestal begin december."
        />
        <Faq
          question="Mag ik elk nummer kiezen dat ik wil?"
          answer="Ja, je mag vrijwel elk nummer insturen, zolang het officieel is uitgebracht. Je kunt kiezen uit een suggestielijst of zelf een nummer toevoegen."
        />
        <Faq
          question="Welk nummer staat het vaakst op nummer 1?"
          answer="Bohemian Rhapsody van Queen staat het vaakst op nummer 1 in de geschiedenis van de Top 2000."
        />
        <Faq
          question="Kan ik de Top 2000 ook online of via een app luisteren?"
          answer="Ja, de Top 2000 is te beluisteren via NPO Radio 2, de NPO Luister-app en via diverse online streams."
        />
        <Faq
          question="Bestaat de Top 2000 ook als lijst na afloop?"
          answer="Ja, na de uitzending is de volledige lijst online terug te vinden, inclusief statistieken, artiestenoverzichten en jaartallen."
        />
      </main>
      <Footer />
    </div>
  );
}

export default FAQ;
