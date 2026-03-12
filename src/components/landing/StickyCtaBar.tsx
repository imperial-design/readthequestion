import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';

export function StickyCtaBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const pricingEl = document.getElementById('pricing');
        const scrollY = window.scrollY;

        if (pricingEl) {
          const rect = pricingEl.getBoundingClientRect();
          const pricingInView = rect.top < window.innerHeight && rect.bottom > 0;
          setVisible(scrollY > 500 && !pricingInView);
        } else {
          setVisible(scrollY > 500);
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg safe-area-bottom"
        >
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div>
              <p className="font-display font-bold text-sm text-gray-800">
                &pound;19.99 <span className="font-normal text-gray-500">one time</span>
              </p>
              <p className="font-display text-xs text-gray-500">Full programme &middot; Whole family</p>
            </div>
            <Link
              to="/signup"
              className="shrink-0 px-6 py-2.5 rounded-button font-display font-bold text-white text-sm bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 hover:from-purple-700 hover:via-fuchsia-700 hover:to-pink-600 transition-all shadow-md"
            >
              Get started
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
