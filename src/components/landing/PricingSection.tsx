import { Link } from 'react-router';
import { SectionWrapper } from './SectionWrapper';

export function PricingSection() {
  return (
    <SectionWrapper id="pricing">
      <div className="space-y-5">
        <h2 className="font-display font-extrabold text-xl text-gray-800 text-center">
          One price. One time. The whole family.
        </h2>

        {/* Price card */}
        <div className="text-center">
          <p className="font-display font-extrabold text-5xl text-fuchsia-600 mt-1">
            &pound;19.99
          </p>
          <p className="font-display text-sm text-gray-500 mt-1">
            One-time payment &middot; Lifetime access &middot; The whole family
          </p>
        </div>

        {/* Urgency */}
        <div className="bg-purple-50 rounded-card p-3 border border-purple-200/50 text-center">
          <p className="font-display text-sm text-purple-700 font-semibold">
            Beta price &mdash; will increase after launch.
          </p>
        </div>

        {/* Anchor */}
        <p className="font-display text-sm text-gray-600 text-center leading-relaxed">
          One private tutor session costs &pound;30&ndash;&pound;50.
          <br />
          AnswerTheQuestion! costs less &mdash; and over 12 weeks, builds your child&rsquo;s focus and exam technique.
        </p>

        {/* Features */}
        <div className="grid grid-cols-2 gap-2">
          {[
            ['\ud83d\udcda', '12-week CLEAR Method programme'],
            ['\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d\udc66', 'Multi-child \u2014 whole family'],
            ['\ud83e\uddd8', 'Breathing & calm exercises'],
            ['\ud83d\udcca', 'Parent progress dashboard'],
            ['\ud83e\udd89', 'Professor Hoot companion'],
            ['\ud83c\udfc6', 'Certificate of Achievement'],
          ].map(([emoji, text], i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-700 font-display">
              <span className="shrink-0">{emoji}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* Guarantee — integrated */}
        <div className="bg-green-50 rounded-card p-4 border border-green-200/50 text-center">
          <p className="font-display font-bold text-sm text-green-800 mb-1">
            {'\ud83d\udee1\ufe0f'} 7-day money-back guarantee
          </p>
          <p className="font-display text-sm text-green-700 leading-relaxed">
            Try the full programme for 7 days. If it&rsquo;s not right for your child, just email us
            and we&rsquo;ll refund you in full. No forms. No questions.{' '}
            <Link to="/refunds" className="underline hover:text-green-900 transition-colors">
              Read our refund policy.
            </Link>
          </p>
        </div>

        {/* Near-payment reminder */}
        <p className="font-display text-sm text-gray-700 text-center italic">
          Your child knew the answer.
          <br />
          They just didn&rsquo;t read the question properly.
        </p>

        {/* CTA */}
        <Link
          to="/signup"
          className="block w-full py-4 rounded-button font-display font-bold text-white text-lg bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 hover:from-purple-700 hover:via-fuchsia-700 hover:to-pink-600 transition-all shadow-lg text-center"
        >
          Get started &mdash; &pound;19.99
        </Link>

        {/* Trust signals */}
        <div className="flex items-center justify-center gap-4 text-gray-400 text-xs font-display">
          <span>{'\ud83d\udee1\ufe0f'} Secure checkout</span>
          <span>{'\ud83d\udcb3'} Powered by Stripe</span>
        </div>
      </div>
    </SectionWrapper>
  );
}
