import { SectionWrapper } from './SectionWrapper';

export function StorySection() {
  return (
    <SectionWrapper>
      <div className="space-y-4">
        <h2 className="font-display font-extrabold text-xl text-gray-800 text-center">
          How it started
        </h2>

        <p className="text-gray-700 font-display text-sm leading-relaxed italic">
          My daughter had just finished her 11+ comprehension practice. I started marking
          and stopped cold at Question 1: &ldquo;In what year did scientists discover the
          colour of&hellip;&rdquo; Her answer? Blue.
        </p>

        <p className="text-gray-700 font-display text-sm leading-relaxed italic">
          I asked her to read the question again &mdash; out loud. She got to &ldquo;In what
          year&hellip;&rdquo; and immediately: &ldquo;D&rsquo;uh! It&rsquo;s meant to be 1957!&rdquo;
        </p>

        <div className="bg-purple-50 rounded-card p-4 border border-purple-200/50 text-center">
          <p className="font-display text-sm text-purple-800 italic font-semibold leading-relaxed">
            She had known the correct answer all along.
            <br />
            She just hadn&rsquo;t read the question. And this was question one.
          </p>
        </div>

        <p className="text-gray-700 font-display text-sm leading-relaxed">
          Talking to other parents navigating 11+ and independent school prep, the story was
          always the same. Bright, capable kids losing marks &mdash; not because they didn&rsquo;t
          know the material &mdash; but because they didn&rsquo;t read the question. No one had
          found a fix.
        </p>

        <p className="text-gray-800 font-display text-base font-bold text-center">
          So I built one.
        </p>

        <p className="text-gray-600 font-display text-sm leading-relaxed">
          AnswerTheQuestion! is a 12-week programme that trains children to do the one thing
          that unlocks the marks they already can get &mdash; teaching them the habit that
          ensures every answer counts.
        </p>

        <p className="text-gray-800 font-display text-sm font-bold">
          &mdash; Rebecca, Founder
        </p>
      </div>
    </SectionWrapper>
  );
}
