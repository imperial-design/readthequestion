import { Link } from 'react-router';
import { motion } from 'framer-motion';

export function FinalCtaSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto px-5 py-16 text-center"
    >
      <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white drop-shadow-md mb-4 leading-tight max-w-xl mx-auto">
        Some questions they won&rsquo;t know.
        <br />
        Don&rsquo;t let them lose marks on the ones they do.
      </h2>

      <p className="text-white/80 font-display text-base md:text-lg max-w-lg mx-auto leading-relaxed mb-8">
        You&rsquo;ve put in the work. Your child knows their stuff.
        <br />
        If they&rsquo;re losing marks because they&rsquo;re not reading the question &mdash; this is for you.
      </p>

      <Link
        to="/checkout"
        className="inline-block w-full max-w-md py-5 rounded-2xl font-display font-extrabold text-white text-xl bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-600 hover:from-fuchsia-600 hover:via-purple-700 hover:to-indigo-700 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
      >
        Start the 12-week programme &mdash; &pound;19.99
      </Link>

      <p className="text-white/60 font-display text-xs mt-4">
        7-day money-back guarantee &middot; No subscription
      </p>
    </motion.section>
  );
}
