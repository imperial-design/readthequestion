import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { ProfessorHoot } from '../components/mascot/ProfessorHoot';
import { useAuthStore } from '../stores/useAuthStore';
import { supabase } from '../lib/supabase';

const CRIB_SHEET_STORAGE_KEY = 'atq-crib-sheet-purchased';

export function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const hasCribSheet = searchParams.get('crib_sheet') === '1';
  const updateChildLocally = useAuthStore(s => s.updateChildLocally);
  const currentChildId = useAuthStore(s => s.currentChildId);
  const children = useAuthStore(s => s.children);
  const [verified, setVerified] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Persist crib sheet purchase so HomePage can show the download card later
  useEffect(() => {
    if (hasCribSheet) {
      localStorage.setItem(CRIB_SHEET_STORAGE_KEY, 'true');
    }
  }, [hasCribSheet]);

  // Optimistically mark all children as paid locally,
  // and re-fetch from Supabase to confirm webhook processed
  useEffect(() => {
    if (!sessionId) return;

    // Optimistic local update
    for (const child of children) {
      updateChildLocally(child.id, { hasPaid: true });
    }

    // Poll Supabase to verify webhook has processed (up to 10s)
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      if (attempts > 10) {
        clearInterval(interval);
        setVerified(true); // Assume success after 10s
        return;
      }

      if (!currentChildId) return;
      const { data } = await supabase
        .from('child_profiles')
        .select('has_paid')
        .eq('id', currentChildId)
        .single();

      if (data?.has_paid) {
        clearInterval(interval);
        setVerified(true);
      }
    }, 1000);

    return () => clearInterval(interval);
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const handleDownloadCribSheet = async () => {
    setDownloading(true);
    try {
      const { data } = supabase.storage
        .from('assets')
        .getPublicUrl('crib-sheet/clear-method-crib-sheet.pdf');

      // Fetch the PDF and trigger a download
      const response = await fetch(data.publicUrl);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'CLEAR-Method-Crib-Sheet.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open the URL directly
      const { data } = supabase.storage
        .from('assets')
        .getPublicUrl('crib-sheet/clear-method-crib-sheet.pdf');
      window.open(data.publicUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6 py-4 pb-24 lg:pb-6">
      {/* Celebration */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 10, stiffness: 150, delay: 0.2 }}
        className="text-center"
      >
        <span className="text-7xl block mb-2">🎉</span>
      </motion.div>

      <div className="flex justify-center">
        <ProfessorHoot mood="celebrating" size="lg" animate showSpeechBubble={false} />
      </div>

      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-display text-2xl font-bold text-white drop-shadow-md"
        >
          Hoo-ray! You&rsquo;re all set! 🦉
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-white/80 font-display mt-2 max-w-sm mx-auto"
        >
          Full access unlocked! All 12 weeks of technique training, mock exams, and more are
          now yours. Let&rsquo;s keep building those exam skills!
        </motion.p>
      </div>

      {/* Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white/95 backdrop-blur-sm rounded-card p-6 shadow-sm border border-white/30 text-center"
      >
        {verified ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-green-600">
              <span className="text-2xl">✅</span>
              <span className="font-display font-bold">Payment confirmed!</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/practice')}
              className="w-full py-4 rounded-button font-display font-bold text-white text-lg bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 shadow-lg"
            >
              Start Week 2! 🚀
            </motion.button>
          </div>
        ) : (
          <div className="space-y-3">
            <span className="text-4xl animate-bounce inline-block">🦉</span>
            <p className="font-display font-semibold text-gray-600">
              Confirming your payment...
            </p>
            <p className="text-xs text-gray-400 font-display">This usually takes just a moment</p>
          </div>
        )}
      </motion.div>

      {/* Crib Sheet Download */}
      {hasCribSheet && verified && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white/95 backdrop-blur-sm rounded-card p-6 shadow-sm border border-white/30"
        >
          <div className="text-center space-y-3">
            <span className="text-3xl block">📋</span>
            <h3 className="font-display font-bold text-gray-800">
              Your CLEAR Method Crib Sheet
            </h3>
            <p className="font-display text-sm text-gray-500">
              Print it out and stick it on the fridge, the desk, or inside a homework folder!
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleDownloadCribSheet}
              disabled={downloading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-button font-display font-bold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 shadow-lg disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              {downloading ? 'Downloading…' : 'Download Crib Sheet'}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Back link */}
      <div className="text-center">
        <button
          onClick={() => navigate('/home')}
          className="text-sm text-white/80 font-display hover:text-white/80 transition-colors"
        >
          Back to the nest
        </button>
      </div>
    </div>
  );
}
