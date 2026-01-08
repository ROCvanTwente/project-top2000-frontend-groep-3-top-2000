import React from 'react'
export const Footer = () => {
    return (
        <footer className="container-fluid p-4" style={{ backgroundColor: 'var(--secondary)', color: 'var(--text-color)', padding: '2rem 0' }}>
            <div className="row">
                <div className="col-md-4 col-sm-12 d-flex justify-content-center align-items-center">
                    <img src="/top-2000-logo-empty.png" alt="top2000 logo" className="img-fluid" style={{ maxHeight: '200px' }} />
                </div>
                <div className="col-12">
                    <h3 style={{ color: 'var(--text-color)' }}>Contact</h3>
                    <p style={{ color: 'var(--text-color)' }}>Bekijk hieronder alle contactgegevens</p>
                </div>
                <div className="col-md-4 col-sm-12">
                    <div className="contact-info">
                        <p style={{ color: 'var(--text-color)' }}><strong>Tel.nr.Studio</strong>: 0800-1122 (gratis)</p>
                        <p style={{ color: 'var(--text-color)' }}><strong>E-mail</strong>: info@radio2.nl</p>
                        <p style={{ color: 'var(--text-color)' }}><strong>Twitter</strong>: twitter.com/NPORadio2</p>
                        <p style={{ color: 'var(--text-color)' }}><strong>Facebook</strong>: Facebook.com/top2000</p>
                    </div>
                </div>
                <div className="d-none d-md-block col-md-1">
                    <div style={{ borderLeft: '2px solid white', height: '100%' }}></div>
                </div>
                <div className="col-md-4 col-sm-12">
                    <div className="contact-info">
                        <p style={{ color: 'var(--text-color)' }}><strong>Adress</strong>:</p>
                        <p style={{ color: 'var(--text-color)' }}>
                            Postbus2644<br />
                            1217ZL Hilversum
                        </p>
                        <p style={{ color: 'var(--text-color)' }}><strong>Bezoekadres</strong>: Bert de graaffweg2</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
