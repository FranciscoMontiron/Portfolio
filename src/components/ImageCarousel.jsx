import React, { useState, useEffect, useRef } from 'react';

const ImageCarousel = ({ images = [], autoPlay = true, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // Filter out empty images
  const validImages = images.filter(img => img && img.trim() !== '');
  
  useEffect(() => {
    if (autoPlay && !isHovered && validImages.length > 1) {
      intervalRef.current = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex(prev => (prev + 1) % validImages.length);
          setIsTransitioning(false);
        }, 800);
      }, interval);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlay, isHovered, interval, validImages.length]);

  if (validImages.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyIcon}>📷</div>
        <span style={styles.emptyText}>No images available</span>
      </div>
    );
  }

  const getImageUrl = (img) => {
    if (img.startsWith('http')) return img;
    return `${API_URL}${img}`;
  };

  const goToSlide = (index) => {
    if (index !== currentIndex) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsTransitioning(false);
      }, 400);
    }
  };

  const nextSlide = () => {
    goToSlide((currentIndex + 1) % validImages.length);
  };

  const prevSlide = () => {
    goToSlide((currentIndex - 1 + validImages.length) % validImages.length);
  };

  return (
    <div 
      style={styles.container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ambient glow effect */}
      <div style={styles.ambientGlow} />
      
      {/* Main 3D viewport */}
      <div style={styles.viewport}>
        <div style={styles.track}>
          {validImages.map((img, index) => {
            const offset = index - currentIndex;
            const isActive = index === currentIndex;
            const isPrev = offset === -1 || (currentIndex === 0 && index === validImages.length - 1);
            const isNext = offset === 1 || (currentIndex === validImages.length - 1 && index === 0);
            
            // Calculate 3D transform based on position
            let translateZ = -300;
            let translateX = offset * 60;
            let rotateY = offset * -15;
            let scale = 0.7;
            let opacity = 0;
            let blur = 8;

            if (isActive) {
              translateZ = isTransitioning ? -50 : 0;
              translateX = 0;
              rotateY = 0;
              scale = isTransitioning ? 1.05 : 1;
              opacity = 1;
              blur = 0;
            } else if (isPrev || isNext) {
              translateZ = -150;
              translateX = isPrev ? -40 : 40;
              rotateY = isPrev ? 25 : -25;
              scale = 0.85;
              opacity = 0.4;
              blur = 3;
            }

            return (
              <div
                key={`${img}-${index}`}
                style={{
                  ...styles.slide,
                  transform: `
                    perspective(1200px)
                    translateZ(${translateZ}px) 
                    translateX(${translateX}%) 
                    rotateY(${rotateY}deg)
                    scale(${scale})
                  `,
                  opacity,
                  filter: `blur(${blur}px)`,
                  zIndex: isActive ? 10 : 5 - Math.abs(offset),
                  boxShadow: isActive 
                    ? '0 25px 80px rgba(0, 245, 255, 0.3), 0 10px 40px rgba(0, 0, 0, 0.5)' 
                    : '0 10px 30px rgba(0, 0, 0, 0.3)',
                }}
              >
                <img 
                  src={getImageUrl(img)} 
                  alt={`Project image ${index + 1}`}
                  style={styles.image}
                  loading="lazy"
                />
                {/* Shine overlay on active */}
                {isActive && (
                  <div style={styles.shineOverlay} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Reflection effect */}
      <div style={styles.reflection}>
        {validImages[currentIndex] && (
          <img 
            src={getImageUrl(validImages[currentIndex])} 
            alt="Reflection"
            style={styles.reflectionImage}
          />
        )}
      </div>

      {/* Navigation arrows */}
      {validImages.length > 1 && (
        <>
          <button 
            style={{ ...styles.arrow, ...styles.arrowLeft }}
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button 
            style={{ ...styles.arrow, ...styles.arrowRight }}
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      {/* Navigation dots */}
      {validImages.length > 1 && (
        <div style={styles.dots}>
          {validImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              style={{
                ...styles.dot,
                ...(index === currentIndex ? styles.dotActive : {})
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress bar */}
      {validImages.length > 1 && autoPlay && (
        <div style={styles.progressContainer}>
          <div 
            style={{
              ...styles.progressBar,
              animation: isHovered ? 'none' : `progressFill ${interval}ms linear infinite`
            }} 
          />
        </div>
      )}

      <style>{`
        @keyframes progressFill {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes shine {
          from { transform: translateX(-100%) rotate(25deg); }
          to { transform: translateX(200%) rotate(25deg); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: '450px',
    overflow: 'hidden',
    borderRadius: '20px',
    background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%)',
  },
  ambientGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '60%',
    background: 'radial-gradient(ellipse, rgba(0, 245, 255, 0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  viewport: {
    width: '100%',
    height: '350px',
    perspective: '1500px',
    perspectiveOrigin: 'center center',
    position: 'relative',
    zIndex: 1,
  },
  track: {
    position: 'relative',
    width: '100%',
    height: '100%',
    transformStyle: 'preserve-3d',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    position: 'absolute',
    width: '70%',
    maxWidth: '800px',
    height: '100%',
    transition: 'all 1.2s cubic-bezier(0.23, 1, 0.32, 1)',
    transformOrigin: 'center center',
    borderRadius: '16px',
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  shineOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)',
    animation: 'shine 3s ease-in-out infinite',
    pointerEvents: 'none',
  },
  reflection: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60%',
    maxWidth: '700px',
    height: '80px',
    overflow: 'hidden',
    opacity: 0.2,
    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 100%)',
    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 100%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  reflectionImage: {
    width: '100%',
    height: 'auto',
    transform: 'scaleY(-1)',
    filter: 'blur(2px)',
  },
  dots: {
    position: 'absolute',
    bottom: '25px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '12px',
    zIndex: 20,
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.3)',
    border: '2px solid rgba(255, 255, 255, 0.5)',
    cursor: 'pointer',
    transition: 'all 0.4s ease',
    padding: 0,
  },
  dotActive: {
    background: 'var(--accent-color)',
    borderColor: 'var(--accent-color)',
    transform: 'scale(1.3)',
    boxShadow: '0 0 20px var(--accent-color)',
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    zIndex: 20,
    opacity: 0.8,
  },
  arrowLeft: {
    left: '20px',
  },
  arrowRight: {
    right: '20px',
  },
  progressContainer: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    height: '3px',
    background: 'rgba(255, 255, 255, 0.1)',
    zIndex: 20,
  },
  progressBar: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--accent-color), rgba(0, 245, 255, 0.5))',
    boxShadow: '0 0 10px var(--accent-color)',
  },
  emptyContainer: {
    width: '100%',
    height: '300px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.05) 100%)',
    borderRadius: '20px',
    border: '1px dashed rgba(255, 255, 255, 0.1)',
    gap: '12px',
  },
  emptyIcon: {
    fontSize: '3rem',
    opacity: 0.4,
  },
  emptyText: {
    color: 'var(--text-dim)',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-mono)',
  },
};

export default ImageCarousel;
