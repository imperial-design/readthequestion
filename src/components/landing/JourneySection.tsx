import { Link } from 'react-router';
import { SectionWrapper } from './SectionWrapper';

const PHASES = [
  {
    name: 'Foundation',
    emoji: '\ud83c\udf31',
    weeks: '1\u20134',
    description: 'Learn the CLEAR Method. Build the habit of reading carefully.',
    color: 'border-amber-400/60 bg-amber-50',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  {
    name: 'Improvers',
    emoji: '\ud83d\udd25',
    weeks: '5\u20138',
    description: 'Faster pace, trickier questions. Sharpen under time pressure.',
    color: 'border-orange-400/60 bg-orange-50',
    badgeColor: 'bg-orange-100 text-orange-700',
  },
  {
    name: 'Exam Ready',
    emoji: '\ud83d\ude80',
    weeks: '9\u201312',
    description: 'Embedded habits. Real confidence. Exam ready.',
    color: 'border-rose-400/60 bg-rose-50',
    badgeColor: 'bg-rose-100 text-rose-700',
  },
];

export function JourneySection() {
  return (
    <SectionWrapper>
      <div className="space-y-4">
        <h2 className="font-display font-extrabold text-xl text-gray-800 text-center">
          The 12-Week Journey
        </h2>

        <p className="text-gray-600 font-display text-sm text-center leading-relaxed">
          A structured programme that builds real exam technique &mdash; week by week, step by step.
        </p>

        <div className="space-y-3 mt-4">
          {PHASES.map((phase) => (
            <div
              key={phase.name}
              className={`rounded-card border-2 ${phase.color} p-4`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`${phase.badgeColor} px-2 py-0.5 rounded-full text-xs font-display font-bold`}>
                  Weeks {phase.weeks}
                </span>
                <span className="font-display font-bold text-sm text-gray-800">
                  {phase.emoji} {phase.name}
                </span>
              </div>
              <p className="font-display text-sm text-gray-600 leading-relaxed">
                {phase.description}
              </p>
            </div>
          ))}
        </div>

        {/* Session format — prominent */}
        <div className="bg-purple-50 rounded-card p-5 mt-4 border border-purple-200/50 text-center">
          <p className="font-display font-extrabold text-base text-purple-800">
            10 questions. 15 minutes. Done.
          </p>
          <p className="font-display text-sm text-purple-600 mt-1">
            Short enough to fit around homework &mdash; powerful enough to build a lasting habit.
          </p>
        </div>

        {/* Key features grid */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="bg-blue-50 rounded-card p-3 border border-blue-200/50 text-center">
            <p className="font-display text-sm text-gray-700">
              <span className="font-bold">{'\ud83e\uddd8'} Calm tools</span>
              <br />
              <span className="text-xs text-gray-500">Breathing exercises before every session</span>
            </p>
          </div>
          <div className="bg-green-50 rounded-card p-3 border border-green-200/50 text-center">
            <p className="font-display text-sm text-gray-700">
              <span className="font-bold">{'\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d\udc66'} Multi-child</span>
              <br />
              <span className="text-xs text-gray-500">One purchase, the whole family</span>
            </p>
          </div>
          <div className="bg-amber-50 rounded-card p-3 border border-amber-200/50 text-center">
            <p className="font-display text-sm text-gray-700">
              <span className="font-bold">{'\ud83c\udfc6'} Certificate</span>
              <br />
              <span className="text-xs text-gray-500">Personalised on completion</span>
            </p>
          </div>
          <div className="bg-fuchsia-50 rounded-card p-3 border border-fuchsia-200/50 text-center">
            <p className="font-display text-sm text-gray-700">
              <span className="font-bold">{'\ud83e\udd89'} Professor Hoot</span>
              <br />
              <span className="text-xs text-gray-500">Your child&rsquo;s study companion</span>
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-4">
          <Link
            to="/signup"
            className="inline-block w-full py-3.5 rounded-button font-display font-bold text-white text-base bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 hover:from-purple-700 hover:via-fuchsia-700 hover:to-pink-600 transition-all shadow-md"
          >
            Get started &mdash; &pound;19.99
          </Link>
        </div>
      </div>
    </SectionWrapper>
  );
}
