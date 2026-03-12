import { Link } from 'react-router';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative">
      {/* Brand bar */}
      <div className="max-w-2xl mx-auto px-4 pt-4 pb-2 flex items-center justify-between">
        <span className="font-display font-extrabold text-sm text-white/90 tracking-tight">
          AnswerTheQuestion!
        </span>
        <Link
          to="/login"
          className="text-xs text-white/75 font-display hover:text-white/90 transition-colors"
        >
          Sign in
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6 pb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display font-extrabold text-2xl md:text-4xl text-white drop-shadow-lg leading-tight mb-4">
            Your child knows the answer.
            <br />
            They just didn&rsquo;t read the question.
          </h1>

          <p className="text-white/90 font-display text-base md:text-lg max-w-lg mx-auto mb-6 leading-relaxed">
            AnswerTheQuestion! trains children to slow down and read before they answer &mdash; using the{' '}
            <strong>CLEAR Method</strong>. Perfect for 11+, independent school exams, and a powerful habit for
            any child preparing to start secondary school.
          </p>

          <div className="mb-6">
            <p className="font-display font-extrabold text-4xl text-white drop-shadow-md mb-1">
              &pound;19.99
            </p>
            <p className="text-white/80 font-display text-sm">
              One-time payment &middot; 12 weeks &middot; The whole family
            </p>
          </div>

          <Link
            to="/signup"
            className="inline-block w-full max-w-sm py-4 rounded-button font-display font-bold text-white text-lg bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 hover:from-purple-700 hover:via-fuchsia-700 hover:to-pink-600 transition-all shadow-lg"
          >
            Start the 12-week programme
          </Link>

          <p className="text-white/70 font-display text-xs mt-3">
            7-day money-back guarantee &middot; No subscription &middot; Cancel any time
          </p>
        </motion.div>
      </div>
    </section>
  );
}
