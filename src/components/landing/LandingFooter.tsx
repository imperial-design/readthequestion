import { Link } from 'react-router';

export function LandingFooter() {
  return (
    <footer className="max-w-2xl mx-auto px-4 py-8 text-center">
      <div className="flex items-center justify-center gap-4 text-sm text-white/75 font-display flex-wrap">
        <Link to="/privacy-policy" className="hover:text-white/80 transition-colors">
          Privacy Policy
        </Link>
        <span className="text-white/30">|</span>
        <Link to="/terms" className="hover:text-white/80 transition-colors">
          Terms
        </Link>
        <span className="text-white/30">|</span>
        <Link to="/refunds" className="hover:text-white/80 transition-colors">
          Refund Policy
        </Link>
        <span className="text-white/30">|</span>
        <Link to="/research" className="hover:text-white/80 transition-colors">
          Why It Works
        </Link>
        <span className="text-white/30">|</span>
        <Link to="/login" className="hover:text-white/80 transition-colors">
          Sign In
        </Link>
      </div>
      <p className="text-white/60 font-display text-xs mt-4">
        Made with 🦉 by a working mum
      </p>
    </footer>
  );
}
