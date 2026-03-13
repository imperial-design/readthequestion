import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/useAuthStore';

/**
 * Hook that listens to Supabase auth state changes and syncs with the auth store.
 * Should be mounted once at the top level (e.g. in App).
 */
export function useSupabaseAuth() {
  const setParentSession = useAuthStore(s => s.setParentSession);
  const setPasswordRecovery = useAuthStore(s => s.setPasswordRecovery);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setParentSession(session);
    }).catch((err) => {
      console.warn('Failed to get initial session:', err);
      setParentSession(null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Flag password recovery so useRequireNoAuth doesn't redirect
        if (event === 'PASSWORD_RECOVERY') {
          setPasswordRecovery(true);
        }
        setParentSession(session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setParentSession, setPasswordRecovery]);
}

/**
 * Hook for components that need to redirect on auth state changes.
 * Use in pages like LoginPage / SignupPage to redirect when already logged in.
 */
export function useRequireNoAuth() {
  const navigate = useNavigate();
  const parentSession = useAuthStore(s => s.parentSession);
  const currentChildId = useAuthStore(s => s.currentChildId);
  const isPasswordRecovery = useAuthStore(s => s.isPasswordRecovery);

  useEffect(() => {
    // Don't redirect during password recovery — the user needs to stay on the
    // login page to set a new password even though Supabase gives them a session.
    if (parentSession && !isPasswordRecovery) {
      navigate(currentChildId ? '/home' : '/select-child', { replace: true });
    }
  }, [parentSession, currentChildId, isPasswordRecovery, navigate]);
}
