import { Link } from 'react-router';
import { motion } from 'framer-motion';

const STEPS = [
  {
    letter: 'C',
    name: 'Calm',
    emoji: '🧘',
    description: 'Take a breath. Slow the rush. A calm mind reads more carefully.',
    bg: 'bg-blue-500',
  },
  {
    letter: 'L',
    name: 'Look',
    emoji: '👀',
    description: 'Read the question twice. What is it really asking?',
    bg: 'bg-violet-500',
  },
  {
    letter: 'E',
    name: 'Eliminate',
    emoji: '✂️',
    description: 'Cross out wrong answers. Narrow it down before you choose.',
    bg: 'bg-pink-500',
  },
  {
    letter: 'A',
    name: 'Answer',
    emoji: '❓',
    description: 'Now pick your answer — with confidence, not panic.',
    bg: 'bg-amber-500',
  },
  {
    letter: 'R',
    name: 'Review',
    emoji: '✅',
    description: 'Check it. Does your answer match what the question asked?',
    bg: 'bg-emerald-500',
  },
];

export function ClearMethodSection() {
  return (
    <section className="max-w-3xl mx-auto px-5 py-14">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white drop-shadow-md mb-3 leading-tight">
          The CLEAR Method
        </h2>
        <p className="text-white/80 font-display text-base md:text-lg max-w-lg mx-auto leading-relaxed">
          Five simple steps that work for every subject, every exam, every question.
          A universal technique your child can use for life.
        </p>
      </motion.div>

      <div className="space-y-4">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.letter}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 md:p-6 shadow-sm border border-white/30 flex items-center gap-5"
          >
            <div
              className={`shrink-0 w-14 h-14 rounded-xl ${step.bg} flex items-center justify-center shadow-md`}
            >
              <span className="font-display font-extrabold text-2xl text-white">
                {step.letter}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-extrabold text-base text-gray-800">
                {step.emoji} {step.name}
              </p>
              <p className="font-display text-sm md:text-base text-gray-500 leading-relaxed mt-0.5">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bridge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-center mt-10"
      >
        <p className="text-white/85 font-display font-semibold text-base md:text-lg mb-6 max-w-md mx-auto leading-relaxed">
          Your child already knows the answers.
          <br />
          The CLEAR Method makes sure they show it.
        </p>
        <Link
          to="/signup"
          className="inline-block px-10 py-3.5 rounded-2xl font-display font-bold text-white text-base bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all border border-white/40 hover:scale-[1.02] active:scale-[0.98]"
        >
          Get started &mdash; &pound;19.99
        </Link>
      </motion.div>
    </section>
  );
}
