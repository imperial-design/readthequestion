import { motion } from 'framer-motion';

const PAIN_POINTS = [
  'They circle the smallest number when the question said largest.',
  'They answer three questions beautifully — then skip the fourth because they didn\'t see it.',
  'They write a paragraph when the question asked for one word.',
  'They come out of the exam confident — and you already know what happened.',
  'You\'ve said "read the question" so many times it\'s lost all meaning.',
];

export function ProblemSection() {
  return (
    <section className="bg-white/95 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-5 py-14">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-gray-900 text-center mb-3 leading-tight">
            Your child knows the material.
            <br />
            That&rsquo;s not the problem.
          </h2>

          <p className="text-gray-500 font-display text-base md:text-lg text-center max-w-xl mx-auto mb-8">
            The problem is what happens under pressure. The timer starts. The nerves kick in.
            They skim, spot a familiar word, and write the first thing that comes to mind.
          </p>

          <p className="font-display font-extrabold text-xl md:text-2xl text-purple-700 text-center mb-10">
            Wrong answer. Right knowledge. Lost marks.
          </p>

          {/* Pain points */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 md:p-8 border border-amber-200/60 max-w-xl mx-auto">
            <h3 className="font-display font-extrabold text-base text-gray-800 mb-5">
              If this sounds familiar&hellip;
            </h3>

            <ul className="space-y-3.5">
              {PAIN_POINTS.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 text-gray-700 font-display text-sm md:text-base leading-relaxed"
                >
                  <span className="text-amber-500 shrink-0 mt-0.5 text-lg">&bull;</span>
                  {item}
                </motion.li>
              ))}
            </ul>

            <p className="font-display font-bold text-base text-gray-800 mt-6 text-center leading-relaxed">
              That isn&rsquo;t a knowledge problem &mdash;
              it&rsquo;s an <span className="text-purple-700">exam-technique habit</span>.
              <br />
              And habits can be trained.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
