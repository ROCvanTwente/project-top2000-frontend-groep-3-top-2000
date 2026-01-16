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
                <Faq />
                <Faq />
                <Faq />
                <Faq />
            </main>
        </div>
    );                    
}

export default FAQ;
