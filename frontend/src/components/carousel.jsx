import React, { useState } from 'react'

export const Carousel = ({ items = [], carouselId = "defaultCarousel", interval = 5000, height = 400 }) => {
    const [hoverLeft, setHoverLeft] = useState(false)
    const [hoverRight, setHoverRight] = useState(false)

    if (!items || items.length === 0) {
        return <div className="text-center p-4">No items to display</div>
    }

    // Only show the top 10 slides (or fewer if items has less)
    const slides = items.slice(0, 10)

    return (
        <div id={carouselId} className="carousel slide" data-bs-ride="carousel" data-bs-interval={interval} style={{ position: 'relative' }}>
            {/* Indicators */}
            <div className="carousel-indicators">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        data-bs-target={`#${carouselId}`}
                        data-bs-slide-to={index}
                        className={index === 0 ? "active" : ""}
                        aria-current={index === 0 ? "true" : "false"}
                        aria-label={`Slide ${index + 1}`}
                    ></button>
                ))}
            </div>

            {/* Carousel Inner */}
            <div className="carousel-inner">
                {slides.map((item, index) => {
                    return (
                        <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                            <div style={{ height: `${height}px`, overflow: 'hidden', display: 'flex', alignItems: 'center', position: 'relative', backgroundColor: 'transparent' }}>
                                {item.href ? (
                                    <a href={item.href} target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%', height: '100%', position: 'relative', zIndex: 1 }}>
                                        <div
                                            role="img"
                                            aria-label={item.alt || `Slide ${index + 1}`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                backgroundImage: `url(${item.image})`,
                                                backgroundSize: 'contain',
                                                backgroundPosition: 'center center',
                                                backgroundRepeat: 'no-repeat',
                                                margin: '0 auto'
                                            }}
                                        />
                                    </a>
                                ) : (
                                    <div
                                        role="img"
                                        aria-label={item.alt || `Slide ${index + 1}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            backgroundImage: `url(${item.image})`,
                                            backgroundSize: 'contain',
                                            backgroundPosition: 'center center',
                                            backgroundRepeat: 'no-repeat',
                                            margin: '0 auto',
                                            position: 'relative',
                                            zIndex: 1
                                        }}
                                    />
                                )}
                            </div>
                            {item.caption && (
                                <div className="carousel-caption d-none d-md-block">
                                    <h5 style={{ color: 'var(--text-color)' }}>{item.caption}</h5>
                                    {item.description && (
                                        <p style={{ color: 'var(--text-color)' }}>{item.description}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Previous - Left hover zone with fade effect */}
            <button
                className="carousel-control-prev"
                type="button"
                data-bs-target={`#${carouselId}`}
                data-bs-slide="prev"
                onMouseEnter={() => setHoverLeft(true)}
                onMouseLeave={() => setHoverLeft(false)}
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '15%',
                    border: 'none',
                    background: hoverLeft 
                        ? 'linear-gradient(to right, rgba(0,0,0,0.4), rgba(0,0,0,0.15), transparent)'
                        : 'transparent',
                    cursor: 'pointer',
                    transition: 'background 0.3s ease',
                    zIndex: 10,
                    opacity: 1,
                }}
            >
                <span className="visually-hidden">Previous</span>
            </button>

            {/* Next - Right hover zone with fade effect */}
            <button
                className="carousel-control-next"
                type="button"
                data-bs-target={`#${carouselId}`}
                data-bs-slide="next"
                onMouseEnter={() => setHoverRight(true)}
                onMouseLeave={() => setHoverRight(false)}
                style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: '15%',
                    border: 'none',
                    background: hoverRight 
                        ? 'linear-gradient(to left, rgba(0,0,0,0.4), rgba(0,0,0,0.15), transparent)'
                        : 'transparent',
                    cursor: 'pointer',
                    transition: 'background 0.3s ease',
                    zIndex: 10,
                    opacity: 1,
                }}
            >
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    )
}
