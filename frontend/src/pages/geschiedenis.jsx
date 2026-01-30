import React, { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/navBar";
import { Sidebar } from "../components/sidebar";
import { Footer } from "../components/footer";
import "./geschiedenis.css";

const milestones = [
    {
        year: "1999",
        title: "Eerste editie",
        description:
            "De Top 2000 wordt gelanceerd als millenniumlijst en groeit direct uit tot een nationale traditie.",
    },
    {
        year: "2001",
        title: "Top 2000 Cafe",
        description:
            "Live radio vanuit het Top 2000 Cafe zorgt voor het herkenbare huiskamersfeertje rond de lijst.",
    },
    {
        year: "2011",
        title: "Top 2000 a gogo",
        description:
            "Het tv-programma met verhalen achter de muziek laat zien waarom nummers zo geliefd zijn.",
    },
    {
        year: "2020",
        title: "Samen op afstand",
        description:
            "Ook in een bijzonder jaar blijft de lijst doorgaan en wordt de verbinding via radio nog sterker.",
    },
    {
        year: "Vandaag",
        title: "Publieksicoon",
        description:
            "Miljoenen stemmen, volle radio-dagen en tradities rond kerst en oudjaar maken de lijst tijdloos.",
    },
];

const highlights = [
    {
        title: "Nederlands ritueel",
        text: "Eind december staat bijna elke huiskamer, werkplek of auto afgestemd op de Top 2000.",
    },
    {
        title: "Verhalen achter nummers",
        text: "Van klassiekers tot nieuwe binnenkomers: elke positie heeft een verhaal en emotie.",
    },
    {
        title: "Live beleving",
        text: "Het Top 2000 Cafe en de tv-registraties geven het gevoel dat je er zelf bij bent.",
    },
];

const stemfases = [
    {
        label: "Nomineren",
        detail: "In november kies je je favorieten uit de hele muziekgeschiedenis.",
    },
    {
        label: "Stemweek",
        detail: "Luisteraars stemmen op een persoonlijke toplijst; nieuwe nummers kunnen binnenkomen.",
    },
    {
        label: "Bekendmaking",
        detail: "Begin december wordt de volledige Top 2000 onthuld en start het speculeren.",
    },
    {
        label: "Uitzending",
        detail: "Van eerste kerstdag tot oudejaarsavond hoor je non-stop de complete lijst op NPO Radio 2.",
    },
];

const records = [
    "Bohemian Rhapsody van Queen voert vaker de lijst aan dan elk ander nummer.",
    "Stairway to Heaven en Hotel California staan al sinds de start in de hoogste regionen.",
    "Nederlandse acts als Boudewijn de Groot en Danny Vera laten zien hoe breed de lijst leeft.",
    "Jaarlijks stromen nieuwe nummers binnen, maar klassiekers behouden een trouwe achterban.",
];

const Geschiedenis = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleMenuToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleCloseSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="history-page">
            <NavBar onMenuToggle={handleMenuToggle} />
            <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

            <main className="history-main">
                <section className="history-hero">
                    <div className="container">
                        <div className="row align-items-center gy-4">
                            <div className="col-lg-7">
                                <span className="hero-badge">Sinds 1999</span>
                                <h1>Geschiedenis van de Top 2000</h1>
                                <p className="lead">
                                    De Top 2000 is uitgegroeid tot het jaarlijkse muzikale hartslagmoment van Nederland.
                                    Een week lang vormt de lijst de soundtrack van feestdagen, herinneringen en nieuwe ontdekkingen.
                                </p>
                                <div className="hero-stats">
                                    <div className="stat-card">
                                        <span className="stat-label">Stemmen per editie</span>
                                        <span className="stat-value">Miljoenen</span>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-label">Uitzenduren</span>
                                        <span className="stat-value">168+</span>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-label">Locatie</span>
                                        <span className="stat-value">Top 2000 Cafe</span>
                                    </div>
                                </div>
                                <div className="hero-actions">
                                    <Link className="btn btn-primary" to="/Songlist">
                                        Bekijk de lijst
                                    </Link>
                                    <a className="btn btn-outline-secondary" href="#timeline">
                                        Naar de tijdlijn
                                    </a>
                                </div>
                            </div>

                            <div className="col-lg-5">
                                <div className="hero-panel">
                                    <h3>Waar draait het om?</h3>
                                    <ul className="hero-list">
                                        <li>
                                            Muziek die generaties verbindt, van jaren 60 tot vandaag.
                                        </li>
                                        <li>
                                            Verhalen van luisteraars: herinneringen, tradities en persoonlijke top 5 lijstjes.
                                        </li>
                                        <li>
                                            Live sfeer vanuit het Top 2000 Cafe, inclusief tv-fragmenten en interviews.
                                        </li>
                                    </ul>
                                    <div className="badge-row">
                                        <span className="pill">Radio</span>
                                        <span className="pill">Televisie</span>
                                        <span className="pill">Online</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="history-highlights">
                    <div className="container">
                        <div className="section-heading">
                            <h2 color="#333">Waarom de Top 2000 speciaal blijft</h2>
                            <p>
                                Elk jaar krijgt de lijst een nieuw karakter, maar de kern blijft hetzelfde: herkenning, emotie en een gedeelde liefde voor muziek.
                            </p>
                        </div>
                        <div className="row g-4">
                            {highlights.map((item) => (
                                <div className="col-md-4" key={item.title}>
                                    <div className="highlight-card">
                                        <h3 color="#333">{item.title}</h3>
                                        <p color="#333">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="timeline" className="history-timeline">
                    <div className="container">
                        <div className="section-heading">
                            <h2>Tijdlijn met mijlpalen</h2>
                            <p>Een beknopt overzicht van momenten die de Top 2000 hebben gevormd.</p>
                        </div>
                        <div className="timeline">
                            {milestones.map((milestone) => (
                                <div className="timeline-item" key={milestone.year}>
                                    <div className="timeline-year">{milestone.year}</div>
                                    <div className="timeline-content">
                                        <h4>{milestone.title}</h4>
                                        <p>{milestone.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="history-process">
                    <div className="container">
                        <div className="section-heading">
                            <h2>Hoe de lijst ontstaat</h2>
                            <p>Van nomineren tot de marathonuitzending: zo komt de Top 2000 tot stand.</p>
                        </div>
                        <div className="row g-4">
                            {stemfases.map((fase) => (
                                <div className="col-md-6 col-lg-3" key={fase.label}>
                                    <div className="process-card">
                                        <div className="process-step">{fase.label}</div>
                                        <p>{fase.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="history-records">
                    <div className="container">
                        <div className="row g-4 align-items-start">
                            <div className="col-lg-6">
                                <div className="section-heading">
                                    <h2>Feiten en records</h2>
                                    <p>De lijst is constant in beweging, maar een aantal klassiekers blijft terugkomen.</p>
                                </div>
                                <ul className="record-list">
                                    {records.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="col-lg-6">
                                <div className="record-panel">
                                    <h3>Geluid van december</h3>
                                    <p>
                                        De Top 2000 loopt van eerste kerstdag tot oudejaarsavond. De vaste stem van de dj's,
                                        de meezingmomenten en de verhalen van luisteraars maken het tot een unieke radio-ervaring.
                                    </p>
                                    <div className="mini-stats">
                                        <div>
                                            <span className="mini-label">Gem. luisteruren per dag</span>
                                            <strong className="mini-value">24</strong>
                                        </div>
                                        <div>
                                            <span className="mini-label">Studio</span>
                                            <strong className="mini-value">Beeld & geluid, Hilversum</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="history-cta">
                    <div className="container">
                        <div className="cta-box">
                            <div>
                                <h2>Duik de lijst in</h2>
                                <p>Blader door posities, ontdek verhalen achter nummers en bouw je eigen favorietenlijst.</p>
                            </div>
                            <div className="cta-actions">
                                <Link className="btn btn-light" to="/Songlist">
                                    Bekijk Top 2000
                                </Link>
                                <Link className="btn btn-outline-light" to="/FAQ">
                                    Veelgestelde vragen
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Geschiedenis;
