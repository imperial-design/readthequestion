import { motion } from 'framer-motion';

export function StorySection() {
  return (
    <section className="max-w-3xl mx-auto px-5 py-14">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white drop-shadow-md text-center mb-8 leading-tight">
          How it started
        </h2>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-sm border border-white/30 max-w-xl mx-auto">
          <p className="text-gray-700 font-display text-base leading-relaxed italic mb-4">
            My daughter had just finished her 11+ comprehension practice. I started marking
            and stopped cold at Question 1: &ldquo;In what year did scientists discover the
            colour of&hellip;&rdquo; Her answer? Blue.
          </p>

          <p className="text-gray-700 font-display text-base leading-relaxed italic mb-6">
            I asked her to read the question again &mdash; out loud. She got to &ldquo;In what
            year&hellip;&rdquo; and immediately: &ldquo;D&rsquo;uh! It&rsquo;s meant to be 1957!&rdquo;
          </p>

          <div className="bg-purple-50 rounded-xl p-5 border border-purple-200/50 text-center mb-6">
            <p className="font-display text-base text-purple-800 italic font-bold leading-relaxed">
              She had known the correct answer all along.
              <br />
              She just hadn&rsquo;t read the question.
            </p>
          </div>

          <p className="text-gray-600 font-display text-sm md:text-base leading-relaxed mb-4">
            Talking to other parents navigating 11+ and independent school prep, the story was
            always the same. Bright, capable kids losing marks &mdash; not because they didn&rsquo;t
            know the material &mdash; but because they didn&rsquo;t read the question.
          </p>

          <p className="font-display font-extrabold text-lg text-gray-900 text-center mb-4">
            So I built one.
          </p>

          <p className="text-gray-500 font-display text-sm leading-relaxed mb-5">
            AnswerTheQuestion! is a 12-week programme that trains children to do the one thing
            that unlocks the marks they already can get &mdash; teaching them the habit that
            ensures every answer counts.
          </p>

          <p className="font-display font-bold text-base text-purple-700">
            &mdash; Rebecca, Founder
          </p>
        </div>
      </motion.div>
    </section>
  );
}
