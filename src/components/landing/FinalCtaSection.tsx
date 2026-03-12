import { Link } from 'react-router';
import { motion } from 'framer-motion';

export function FinalCtaSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto px-4 py-12 my-4 text-center"
    >
      <h2 className="font-display font-extrabold text-2xl text-white drop-shadow-md mb-3 leading-tight">
        Some questions they won&rsquo;t know.
        <br />
        Don&rsquo;t let them lose marks on the ones they do.
      </h2>

      <p className="text-white/85 font-display text-sm max-w-md mx-auto leading-relaxed mb-6">
        You&rsquo;ve put in the work. Your child knows their stuff.
        <br />
        If they&rsquo;re losing marks because they&rsquo;re not reading the question &mdash; this is for you.
      </p>

      <Link
        to="/signup"
        className="inline-block w-full max-w-sm py-4 rounded-button font-display font-bold text-white text-lg bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 hover:from-purple-700 hover:via-fuchsia-700 hover:to-pink-600 transition-all shadow-lg"
      >
        Start the 12-week programme &mdash; &pound;19.99
      </Link>

      <p className="text-white/70 font-display text-xs mt-3">
        7-day money-back guarantee &middot; No subscription
      </p>
    </motion.section>
  );
}
