import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { boxBreathingConfig } from '../../data/visualisation-scripts';

interface PreSessionBreathingProps {
  onComplete: () => void;
}

const TOTAL_CYCLES = 4;

const affirmations = [
  "I am calm, focused, and ready to do my best.",
  "I read carefully and think before I answer.",
  "Mistakes help me learn and grow stronger.",
  "I take my time because I know that's how I succeed.",
  "I am smart enough to solve any question.",
  "I trust my brain — it knows more than I think.",
  "Every question is a chance to show what I can do.",
  "I breathe, I focus, I succeed.",
  "I don't rush — I use my CLEAR Method.",
  "I am getting better every single day.",
  "I believe in myself and my abilities.",
  "I stay calm even when questions are tricky.",
  "I am prepared and I am ready.",
  "My best is always good enough.",
  "I can do hard things.",
  "I am brave, I am strong, I am capable.",
  "I learn something new every time I practise.",
  "I read the question twice because I'm smart like that.",
  "I don't need to be perfect — I just need to try my best.",
  "I am proud of how hard I've worked.",
  "Tricky questions don't scare me — they challenge me.",
  "I take a breath and give my brain time to think.",
  "I trust the process and enjoy the journey.",
  "I notice the key words because I read with purpose.",
  "Every practice session makes me stronger.",
  "I am focused and nothing can distract me.",
  "I choose my answers carefully and with confidence.",
  "I've got this — one question at a time.",
  "My mind is sharp and ready to work.",
  "I eliminate wrong answers like a detective.",
  "I am a brilliant thinker and problem solver.",
  "When I slow down, I speed up my success.",
  "I have the skills to tackle any question.",
  "I feel calm, I feel confident, I feel ready.",
  "Today I will show what I can do.",
];

type BreathPhase = 'inhale' | 'holdIn' | 'exhale' | 'holdOut';

const phaseLabels: Record<BreathPhase, string> = {
  inhale: 'Breathe in…',
  holdIn: 'Hold…',
  exhale: 'Breathe out…',
  holdOut: 'Hold…',
};

const phaseDurations: Record<BreathPhase, number> = {
  inhale: boxBreathingConfig.inhaleSeconds,
  holdIn: boxBreathingConfig.holdInSeconds,
  exhale: boxBreathingConfig.exhaleSeconds,
  holdOut: boxBreathingConfig.holdOutSeconds,
};

const phaseOrder: BreathPhase[] = ['inhale', 'holdIn', 'exhale', 'holdOut'];

function getDailyAffirmation(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return affirmations[dayOfYear % affirmations.length];
}

// Circle scale values for each phase
const phaseScale: Record<BreathPhase, number> = {
  inhale: 1.6,
  holdIn: 1.6,
  exhale: 1.0,
  holdOut: 1.0,
};

export function PreSessionBreathing({ onComplete }: PreSessionBreathingProps) {
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [cycle, setCycle] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [started, setStarted] = useState(false);
  const affirmation = getDailyAffirmation();

  const advancePhase = useCallback(() => {
    setPhase(prev => {
      const currentIdx = phaseOrder.indexOf(prev);
      if (currentIdx === phaseOrder.length - 1) {
        // End of a cycle
        setCycle(prevCycle => {
          const nextCycle = prevCycle + 1;
          if (nextCycle >= TOTAL_CYCLES) {
            setIsComplete(true);
            return prevCycle;
          }
          return nextCycle;
        });
        return 'inhale';
      }
      return phaseOrder[currentIdx + 1];
    });
  }, []);

  // Start the breathing after a brief delay
  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Phase timer
  useEffect(() => {
    if (!started || isComplete) return;

    const duration = phaseDurations[phase] * 1000;
    const timer = setTimeout(advancePhase, duration);
    return () => clearTimeout(timer);
  }, [phase, started, isComplete, advancePhase, cycle]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #4338ca 50%, #6366f1 75%, #7c3aed 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Decorative background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -bottom-32 -right-20 w-80 h-80 rounded-full bg-purple-400/10 blur-3xl" />
        <div className="absolute top-1/4 right-10 w-40 h-40 rounded-full bg-indigo-300/10 blur-2xl" />
      </div>

      {/* Skip button */}
      <button
        onClick={onComplete}
        className="absolute top-6 right-6 text-white/40 hover:text-white/70 text-sm font-display transition-colors z-10"
      >
        Skip
      </button>

      {/* Affirmation */}
      <motion.div
        className="relative z-10 text-center px-8 mb-12 max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <p className="text-white/90 text-xl sm:text-2xl font-display font-bold leading-relaxed italic">
          "{affirmation}"
        </p>
      </motion.div>

      {/* Breathing circle */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-40 h-40 flex items-center justify-center">
          {/* Outer glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(165,180,252,0.3) 0%, transparent 70%)',
            }}
            animate={{
              scale: started && !isComplete ? phaseScale[phase] : 1,
            }}
            transition={{
              duration: phase === 'inhale' || phase === 'exhale'
                ? phaseDurations[phase]
                : 0.3,
              ease: 'easeInOut',
            }}
          />

          {/* Main breathing circle */}
          <motion.div
            className="w-32 h-32 rounded-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(199,210,254,0.8) 0%, rgba(129,140,248,0.6) 50%, rgba(99,102,241,0.4) 100%)',
              boxShadow: '0 0 60px rgba(129,140,248,0.4), inset 0 0 30px rgba(255,255,255,0.2)',
            }}
            animate={{
              scale: started && !isComplete ? phaseScale[phase] : 1,
            }}
            transition={{
              duration: phase === 'inhale' || phase === 'exhale'
                ? phaseDurations[phase]
                : 0.3,
              ease: 'easeInOut',
            }}
          />
        </div>

        {/* Phase label */}
        <AnimatePresence mode="wait">
          {started && !isComplete && (
            <motion.p
              key={phase + cycle}
              className="mt-8 text-white/80 text-lg font-display font-medium"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              {phaseLabels[phase]}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Cycle indicator */}
        {started && !isComplete && (
          <div className="flex gap-2 mt-6">
            {Array.from({ length: TOTAL_CYCLES }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  i < cycle ? 'bg-white/80' : i === cycle ? 'bg-white/50' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Ready button */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            className="relative z-10 mt-12"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, type: 'spring', bounce: 0.4 }}
          >
            <button
              onClick={onComplete}
              className="px-10 py-4 bg-white text-indigo-700 font-display font-bold text-xl rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200"
            >
              I'm Ready! 🚀
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pre-start message */}
      <AnimatePresence>
        {!started && (
          <motion.p
            className="relative z-10 mt-8 text-white/60 text-sm font-display"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            Get comfortable and relax…
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
