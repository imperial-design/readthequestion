import { Link } from 'react-router';
import { motion } from 'framer-motion';

const STEPS = [
  {
    letter: 'C',
    name: 'Calm',
    emoji: '\ud83e\uddd8',
    description: 'Take a breath. Slow the rush. A calm mind reads more carefully.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    letter: 'L',
    name: 'Look',
    emoji: '\ud83d\udc40',
    description: 'Read the question twice. What is it really asking?',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    letter: 'E',
    name: 'Eliminate',
    emoji: '\u2702\ufe0f',
    description: 'Cross out wrong answers. Narrow it down before you choose.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    letter: 'A',
    name: 'Answer',
    emoji: '\u2753',
    description: 'Now pick your answer \u2014 with confidence, not panic.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    letter: 'R',
    name: 'Review',
    emoji: '\u2705',
    description: 'Check it. Does your answer match what the question asked?',
    gradient: 'from-emerald-500 to-green-500',
  },
];

export function ClearMethodSection() {
  return (
    <section className="max-w-2xl mx-auto px-4 py-10 my-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h2 className="font-display font-extrabold text-2xl text-white drop-shadow-md mb-3">
          The CLEAR Method
        </h2>
        <p className="text-white/85 font-display text-sm max-w-md mx-auto leading-relaxed">
          Five simple steps that work for every subject, every exam, every question.
          <br />
          A universal exam technique your child can use for life.
        </p>
      </motion.div>

      <div className="space-y-3">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.letter}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-white/95 backdrop-blur-sm rounded-card p-4 shadow-sm border border-white/30 flex items-start gap-4"
          >
            <div
              className={`shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-md`}
            >
              <span className="font-display font-extrabold text-xl text-white">
                {step.letter}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-sm text-gray-800">
                {step.emoji} {step.name}
              </p>
              <p className="font-display text-sm text-gray-600 leading-relaxed mt-0.5">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bridge + CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-center mt-8"
      >
        <p className="text-white/85 font-display text-sm mb-5 leading-relaxed max-w-md mx-auto">
          Your child already knows the answers.
          <br />
          The CLEAR Method makes sure they show it.
        </p>
        <Link
          to="/signup"
          className="inline-block px-8 py-3 rounded-button font-display font-bold text-white text-sm bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all border border-white/30"
        >
          Get started &mdash; &pound;19.99
        </Link>
      </motion.div>
    </section>
  );
}
