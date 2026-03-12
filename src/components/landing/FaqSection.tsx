import { useState } from 'react';
import { SectionWrapper } from './SectionWrapper';

const FAQ_ITEMS = [
  {
    question: 'Which subjects does it cover?',
    answer:
      'AnswerTheQuestion! covers English, Maths, Verbal Reasoning and Non-Verbal Reasoning \u2014 the core 11+ and independent school exam subjects. The CLEAR Method works across all of them because it teaches how to approach any question, not just specific content.',
  },
  {
    question: 'How is this different from doing more practice papers?',
    answer:
      'Practice papers test your child. AnswerTheQuestion! trains them. Most children already know the material \u2014 they lose marks because they rush, misread, or panic. The CLEAR Method builds the exam-technique habit that practice papers assume your child already has.',
  },
  {
    question: 'How long is each session?',
    answer:
      'Each daily session is 10 questions and takes around 10\u201315 minutes. It\u2019s designed to be short enough to fit alongside homework and other activities, but focused enough to build real exam technique.',
  },
  {
    question: 'Which schools and exams is this for?',
    answer:
      'AnswerTheQuestion! is designed for children preparing for 11+ exams (GL, CEM, ISEB) and independent school entrance tests. However, the CLEAR Method is a universal exam technique that helps with school tests, SATs, and assessments of every kind.',
  },
  {
    question: 'What year group is it best for?',
    answer:
      'It\u2019s ideal for children in Year 4 and Year 5 who are preparing for entrance exams. Some families start in late Year 3. The programme works well alongside existing tutoring or self-study.',
  },
  {
    question: 'Can I use it for more than one child?',
    answer:
      'Yes! One purchase covers your whole family. You can add multiple child profiles, and each child gets their own independent 12-week journey with separate progress tracking, badges, and a personalised certificate.',
  },
  {
    question: 'Is this a subscription?',
    answer:
      'No. It\u2019s a one-time payment of \u00a319.99 for lifetime access to the full 12-week programme \u2014 for the whole family. No recurring charges, no hidden fees.',
  },
  {
    question: 'What if it doesn\u2019t work for my child?',
    answer:
      'We offer a 7-day money-back guarantee. If it\u2019s not the right fit, just email us and we\u2019ll refund you in full \u2014 no questions asked.',
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <SectionWrapper>
      <div className="space-y-4">
        <h2 className="font-display font-extrabold text-xl text-gray-800 text-center">
          Parents ask&hellip;
        </h2>

        <div className="space-y-2">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="rounded-card border border-gray-200/80 bg-white overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-button-${i}`}
                  className="w-full flex items-center justify-between p-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                >
                  <span className="font-display font-bold text-sm text-gray-800 pr-4">
                    {item.question}
                  </span>
                  <span
                    className={`text-gray-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    {'\u25bc'}
                  </span>
                </button>
                {isOpen && (
                  <div id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-button-${i}`} className="px-4 pb-4">
                    <p className="font-display text-sm text-gray-600 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
