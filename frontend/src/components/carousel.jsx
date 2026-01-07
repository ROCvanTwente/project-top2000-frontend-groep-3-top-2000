import React from 'react'

export const Carousel = ({ items = [], carouselId = "defaultCarousel" }) => {
    if (!items || items.length === 0) {
        return <div className="text-center p-4">No items to display</div>
    }

    return (
        <div id={carouselId} className="carousel slide" data-bs-ride="carousel">
            {/* Indicators */}
            <div className="carousel-indicators">
                {items.map((_, index) => (
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
                {items.map((item, index) => (
                    <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                        {item.href ? (
                            <a href={item.href} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={item.image}
                                    className="d-block w-100"
                                    alt={item.alt || `Slide ${index + 1}`}
                                    style={{ height: '400px', objectFit: 'cover' }}
                                />
                            </a>
                        ) : (
                            <img
                                src={item.image}
                                className="d-block w-100"
                                alt={item.alt || `Slide ${index + 1}`}
                                style={{ height: '400px', objectFit: 'cover' }}
                            />
                        )}
                        {item.caption && (
                            <div className="carousel-caption d-none d-md-block">
                                <h5 style={{ color: 'var(--text-color)' }}>{item.caption}</h5>
                                {item.description && (
                                    <p style={{ color: 'var(--text-color)' }}>{item.description}</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Previous Button - iOS Left Arrow */}
            <button
                className="carousel-control-prev"
                type="button"
                data-bs-target={`#${carouselId}`}
                data-bs-slide="prev"
                style={{
                    background: 'none',
                    border: 'none',
                    width: '50px',
                    height: '50px',
                    left: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                }}
            >
                <img
                    src="/icons/ios_arrow_left.png"
                    alt="Previous"
                    width="24"
                    height="24"
                />
                <span className="visually-hidden">Previous</span>
            </button>

            {/* Next Button - iOS Right Arrow */}
            <button
                className="carousel-control-next"
                type="button"
                data-bs-target={`#${carouselId}`}
                data-bs-slide="next"
                style={{
                    background: 'none',
                    border: 'none',
                    width: '50px',
                    height: '50px',
                    right: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                }}
            >
                <img
                    src="/icons/ios_arrow_right.png"
                    alt="Next"
                    width="24"
                    height="24"
                />
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    )
}
