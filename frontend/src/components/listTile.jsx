import React, { useState, useEffect } from 'react'
import graphIcon from '/icons/graph.png'

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return isMobile
}

const styles = {
    wrapper: {
        position: 'relative',
        marginBottom: '12px',
    },
    card: {
        borderRadius: '14px',
        background: 'transparent',
        boxShadow: '4px 8px 2px rgba(0,0,0,0.45)',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minHeight: '80px',
        overflow: 'hidden',
    },
    positionBadge: {
        position: 'absolute',
        left: '-24px',
        top: '-20px',
        minWidth: '34px',
        height: '34px',
        borderRadius: '999px',
        background: 'var(--main-red)',
        color: 'var(--text-color)',
        fontWeight: 700,
        display: 'grid',
        placeItems: 'center',
        boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
        zIndex: 10,
    },
    cover: {
        width: '64px',
        height: '64px',
        borderRadius: '12px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #d0d0d0, #bcbcbc)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
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
        borderRadius: '10px',
        background: 'rgba(255,255,255,0.45)',
        display: 'block',
    },
    title: {
        fontWeight: 700,
        fontSize: '1rem',
        lineHeight: 1.2,
        color: 'var(--dark-text)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    artist: {
        color: 'var(--dark-text)',
        fontSize: '0.9rem',
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    graph: {
        width: '36px',
        height: '36px',
        objectFit: 'contain',
    },
    badgeBase: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 10px',
        borderRadius: '12px',
        fontWeight: 700,
        fontSize: '0.9rem',
        border: '1px solid transparent',
    },
    badgeUp: {
        background: '#e6f7eb',
        color: '#1f9d55',
        borderColor: '#b7e2c7',
    },
    badgeDown: {
        background: '#fdeaea',
        color: '#c0392b',
        borderColor: '#f3c5c5',
    },
    badgeFlat: {
        background: '#f1f1f1',
        color: '#555',
        borderColor: '#d9d9d9',
    },
    badgeArrow: {
        fontSize: '0.8rem',
        lineHeight: 1,
    },
    contentArea: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flex: '1 1 auto',
        minWidth: 0,
        overflow: 'hidden',
    },
    textContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        flex: '1 1 auto',
        minWidth: 0,
        overflow: 'hidden',
        textAlign: 'left',
        alignItems: 'flex-start',
    },
    rightArea: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexShrink: 0,
        flexWrap: 'nowrap',
    },
}

export const ListTile = ({ position, imagePath, songName, artistName, trend }) => {
    const isMobile = useIsMobile()
    const trendDirection = trend === null || trend === undefined ? null : trend === 0 ? 'flat' : trend > 0 ? 'up' : 'down'
    const trendValue = trendDirection ? Math.abs(trend) : null

    const responsiveStyles = {
        card: {
            ...styles.card,
            padding: isMobile ? '12px 14px' : '14px 16px',
            gap: isMobile ? '8px' : '12px',
        },
        cover: {
            ...styles.cover,
            width: isMobile ? '48px' : '64px',
            height: isMobile ? '48px' : '64px',
        },
        textContainer: {
            ...styles.textContainer,
            textAlign: isMobile ? 'center' : 'left',
            alignItems: isMobile ? 'center' : 'flex-start',
        },
        title: {
            ...styles.title,
            fontSize: isMobile ? '0.9rem' : '1rem',
        },
        artist: {
            ...styles.artist,
            fontSize: isMobile ? '0.8rem' : '0.9rem',
        },
        graph: {
            ...styles.graph,
            width: isMobile ? '24px' : '36px',
            height: isMobile ? '24px' : '36px',
        },
        rightArea: {
            ...styles.rightArea,
            gap: isMobile ? '6px' : '8px',
        },
    }

    const badgeStyle = {
        ...styles.badgeBase,
        padding: isMobile ? '4px 8px' : '6px 10px',
        fontSize: isMobile ? '0.8rem' : '0.9rem',
        gap: isMobile ? '4px' : '6px',
        ...(trendDirection === 'up' ? styles.badgeUp : trendDirection === 'down' ? styles.badgeDown : styles.badgeFlat),
    }

    return (
        <div style={styles.wrapper}>
            <span style={styles.positionBadge}>{position}</span>

            <div style={responsiveStyles.card}>
                <div style={styles.contentArea}>
                    <div style={responsiveStyles.cover} aria-hidden={!imagePath}>
                        {imagePath ? <img style={styles.coverImg} src={imagePath} alt={`${songName} cover`} /> : <span style={styles.placeholder} />}
                    </div>
                    <div style={responsiveStyles.textContainer}>
                        <div style={responsiveStyles.title}>{songName}</div>
                        <div style={responsiveStyles.artist}>{artistName}</div>
                    </div>
                </div>

                <div style={responsiveStyles.rightArea}>
                    <img style={responsiveStyles.graph} src={graphIcon} alt="trend graph" />
                    {trendDirection && (
                        <span style={badgeStyle}>
                            {trendValue}
                            <span style={styles.badgeArrow} aria-hidden="true">
                                {trendDirection === 'up' ? '▲' : trendDirection === 'down' ? '▼' : '–'}
                            </span>
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
