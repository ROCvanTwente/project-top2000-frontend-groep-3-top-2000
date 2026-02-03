import React, { useState, useEffect } from 'react'
import graphIcon from '/icons/graph.png'

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false)

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return isMobile
}

const styles = {
    wrapper: {
        position: 'relative',
        marginBottom: '12px',
        paddingLeft: '0',
        overflow: 'visible',
        color: 'inherit',
        textDecoration: 'none'
    },
    card: {
        position: 'relative',
        borderRadius: '12px',
        background: 'var(--main-red)',
        color: 'var(--text-color)',
        boxShadow: '0 8px 18px rgba(0,0,0,0.45)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        minHeight: '84px',
        overflow: 'hidden',
        border: '5px solid rgba(0,0,0,0.9)'
    },
    positionBadge: {
        position: 'absolute',
        left: '-24px',
        top: '-24px',
        width: '48px',
        height: '48px',
        borderRadius: '999px',
        background: 'var(--secondary)',
        color: 'var(--text-color)',
        fontWeight: 800,
        fontSize: '1.05rem',
        display: 'grid',
        placeItems: 'center',
        boxShadow: '0 6px 14px rgba(0,0,0,0.45)',
        zIndex: 30,
    },
    cover: {
        width: '72px',
        height: '72px',
        borderRadius: '10px',
        overflow: 'hidden',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        border: '3px solid rgba(0,0,0,0.35)',
    },
    coverImg: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
    },
    placeholder: {
        width: '70%',
        height: '70%',
        borderRadius: '8px',
        background: 'rgba(255,255,255,0.12)',
        display: 'block',
    },
    title: {
        fontWeight: 700,
        fontSize: '1.35rem',
        lineHeight: 1.05,
        color: 'var(--text-color)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    artist: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: '1rem',
        lineHeight: 1.1,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    graph: {
        width: '56px',
        height: '56px',
        objectFit: 'contain',
    },
    badgeBase: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 10px',
        borderRadius: '14px',
        fontWeight: 800,
        fontSize: '0.95rem',
        border: '2px solid #1f9d55',
        background: '#ffffff',
        color: '#1f9d55',
    },
    badgeArrow: {
        fontSize: '0.95rem',
        lineHeight: 1,
        color: '#1f9d55'
    },
    contentArea: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flex: '1 1 auto',
        minWidth: 0,
        overflow: 'hidden',
    },
    textContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        flex: '1 1 auto',
        minWidth: 0,
        overflow: 'hidden',
        textAlign: 'left',
        alignItems: 'flex-start',
    },
    rightArea: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexShrink: 0,
        flexWrap: 'nowrap',
    },
}

export const ListTile = ({ position, imagePath, songName, artistName, trend }) => {
    const isMobile = useIsMobile()
    const hasPosition = position !== null && position !== undefined
    const hasTrend = trend !== null && trend !== undefined
    const trendDirection = hasTrend ? (trend === 0 ? 'flat' : trend > 0 ? 'up' : 'down') : null
    const trendValue = trendDirection ? Math.abs(trend) : null

    const responsiveStyles = {
        card: {
            ...styles.card,
            padding: isMobile ? '12px 14px' : styles.card.padding,
            gap: isMobile ? '12px' : '16px',
        },
        cover: {
            ...styles.cover,
            width: isMobile ? '56px' : styles.cover.width,
            height: isMobile ? '56px' : styles.cover.height,
        },
        title: {
            ...styles.title,
            fontSize: isMobile ? '1.1rem' : styles.title.fontSize,
        },
        artist: {
            ...styles.artist,
            fontSize: isMobile ? '0.95rem' : styles.artist.fontSize,
        },
        graph: {
            ...styles.graph,
            width: isMobile ? 44 : styles.graph.width,
            height: isMobile ? 44 : styles.graph.height,
        },
    }

    const pillStyle = (direction) => ({
        ...styles.badgeBase,
        padding: isMobile ? '4px 8px' : styles.badgeBase.padding,
        fontSize: isMobile ? '0.85rem' : styles.badgeBase.fontSize,
        borderColor: direction === 'up' ? '#1f9d55' : direction === 'down' ? '#c0392b' : '#999',
        color: direction === 'up' ? '#1f9d55' : direction === 'down' ? '#c0392b' : '#666'
    })

    const wrapperStyle = {
        ...styles.wrapper,
        marginTop: isMobile ? '14px' : '22px',
        paddingTop: isMobile ? '4px' : '6px'
    }

    return (
        <div style={wrapperStyle}>
            {hasPosition && <span style={styles.positionBadge}>{position}</span>}

            <div style={responsiveStyles.card}>
                <div style={styles.contentArea}>
                    <div style={responsiveStyles.cover} aria-hidden={!imagePath}>
                        {imagePath ? (
                            <img style={styles.coverImg} src={imagePath} alt={`${songName} cover`} />
                        ) : (
                            <span style={styles.placeholder} />
                        )}
                    </div>

                    <div style={styles.textContainer}>
                        <div style={responsiveStyles.title}>{songName}</div>
                        <div style={responsiveStyles.artist}>{artistName}</div>
                    </div>
                </div>

                {hasTrend && (
                    <div style={styles.rightArea}>
                        <img style={responsiveStyles.graph} src={graphIcon} alt="trend graph" />
                        {trendDirection && (
                            <div style={pillStyle(trendDirection)}>
                                <span style={{ background: '#fff', color: (trendDirection === 'down' ? '#c0392b' : '#1f9d55'), padding: '4px 8px', borderRadius: 8, fontWeight: 800 }}>{trendValue}</span>
                                <span style={{ ...styles.badgeArrow, color: (trendDirection === 'down' ? '#c0392b' : '#1f9d55') }} aria-hidden>
                                    {trendDirection === 'up' ? '▲' : trendDirection === 'down' ? '▼' : '–'}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
