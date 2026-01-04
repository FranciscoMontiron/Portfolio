import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ParallaxBackground = () => {
  const { scrollYProgress } = useScroll();
  
  // Grid moves slower than content to create depth (background layer)
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  
  return (
    <div className="fixed inset-0 z-[-2] overflow-hidden pointer-events-none">
      {/* Dynamic Grid */}
      <motion.div 
        style={{ y }}
        className="absolute inset-[-50%] w-[200%] h-[200%] opacity-[0.8]"
      >
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            backgroundPosition: 'center top',
          }}
        />
      </motion.div>

      {/* Radial Gradient Overlay (Static, for vignette effect) */}
      <div 
        className="absolute inset-0 z-[-1]"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 20%, #050505 90%)'
        }}
      />
    </div>
  );
};

export default ParallaxBackground;
