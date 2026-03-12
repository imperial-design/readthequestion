import { SectionWrapper } from './SectionWrapper';

export function ProblemSection() {
  return (
    <SectionWrapper>
      <div className="space-y-4">
        <h2 className="font-display font-extrabold text-xl text-gray-800 text-center">
          Your child knows the material.
          <br />
          That&rsquo;s not the problem.
        </h2>

        <p className="text-gray-600 font-display text-sm leading-relaxed">
          The problem is what happens under pressure. The timer starts. The nerves kick in.
          They skim the question, spot a familiar word, and write the first thing that comes to mind.
        </p>

        <p className="text-gray-700 font-display text-base font-semibold text-center">
          Wrong answer. Right knowledge. Lost marks.
        </p>

        {/* Pain-mirror bullets */}
        <div className="bg-amber-50/80 rounded-card p-4 mt-2 border border-amber-200/50">
          <h3 className="font-display font-bold text-sm text-gray-800 mb-3">
            If this sounds familiar&hellip;
          </h3>
          <ul className="space-y-2">
            {[
              'They finish papers too quickly and come out saying "I knew that one!"',
              'They write "blue" when the question asked "in what year" — and they knew the year.',
              'Nerves make them guess instead of read carefully.',
              'Careless mistakes cost the marks they deserved.',
              'You\'ve told them a hundred times to read the question — and nothing changes.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700 font-display">
                <span className="text-amber-500 shrink-0 mt-0.5">{'\u2713'}</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-700 font-display font-semibold mt-3 text-center">
            That isn&rsquo;t a knowledge problem &mdash; it&rsquo;s an exam-technique habit.
            <br />
            And habits can be trained.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
