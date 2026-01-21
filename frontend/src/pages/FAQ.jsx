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
                question="mdkwd?" 
                answer="mdkvmdk"
                />
                <Faq />
                <Faq />
            </main>
            <Footer />
        </div>
    );                    
}

export default FAQ;
