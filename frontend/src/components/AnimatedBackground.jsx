import React from 'react';
import './AnimatedBackground.css';

export const AnimatedBackground = ({ children }) => {
  return (
    <div className="animated-bg-wrapper">
      <div className="animated-bg">
        {/* Floating music notes - more of them */}
        <div className="music-note note-1">?</div>
        <div className="music-note note-2">?</div>
        <div className="music-note note-3">?</div>
        <div className="music-note note-4">?</div>
        <div className="music-note note-5">?</div>
        <div className="music-note note-6">?</div>
        <div className="music-note note-7">?</div>
        <div className="music-note note-8">?</div>
        <div className="music-note note-9">?</div>
        <div className="music-note note-10">?</div>
        
        {/* Gradient orbs - more visible */}
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="gradient-orb orb-4"></div>
        <div className="gradient-orb orb-5"></div>
        
        {/* Sound wave bars - left side */}
        <div className="sound-waves">
          <div className="wave-bar bar-1"></div>
          <div className="wave-bar bar-2"></div>
          <div className="wave-bar bar-3"></div>
          <div className="wave-bar bar-4"></div>
          <div className="wave-bar bar-5"></div>
          <div className="wave-bar bar-6"></div>
          <div className="wave-bar bar-7"></div>
          <div className="wave-bar bar-8"></div>
          <div className="wave-bar bar-9"></div>
          <div className="wave-bar bar-10"></div>
        </div>
        
        {/* Sound wave bars - right side */}
        <div className="sound-waves-right">
          <div className="wave-bar bar-10"></div>
          <div className="wave-bar bar-9"></div>
          <div className="wave-bar bar-8"></div>
          <div className="wave-bar bar-7"></div>
          <div className="wave-bar bar-6"></div>
          <div className="wave-bar bar-5"></div>
          <div className="wave-bar bar-4"></div>
          <div className="wave-bar bar-3"></div>
          <div className="wave-bar bar-2"></div>
          <div className="wave-bar bar-1"></div>
        </div>
        
        {/* Vinyl records */}
        <div className="vinyl-record vinyl-1"></div>
        <div className="vinyl-record vinyl-2"></div>
        
        {/* Floating dots */}
        <div className="floating-dot dot-1"></div>
        <div className="floating-dot dot-2"></div>
        <div className="floating-dot dot-3"></div>
        <div className="floating-dot dot-4"></div>
        <div className="floating-dot dot-5"></div>
        <div className="floating-dot dot-6"></div>
        <div className="floating-dot dot-7"></div>
        <div className="floating-dot dot-8"></div>
      </div>
      <div className="animated-bg-content">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;
