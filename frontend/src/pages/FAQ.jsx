import "./FAQ.css";
import Faq from "../components/faq.jsx";
import NavBar from "../components/navBar";
import { Sidebar } from "../components/sidebar";
import { Footer } from "../components/footer";

function FAQ() { 
    // useState voor open/closed state

    return (
        <div>
            <NavBar />
            <Sidebar />
            <main className="faq-content">
                <h1 className="faq-title">Frequently Asked Questions</h1>
                 {/* FAQ dropdown */}
                <Faq
                question="What is the top 2000?" 
                answer="the top 2000 is a music event which ranks the 2000 most popular songs as voted by the public."
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
