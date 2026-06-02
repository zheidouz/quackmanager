import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase/config';
import { useAuthStore } from '../../stores/authStore';
import { useSyncStore } from '../../sync/syncStore';
import { useEffect } from 'react';

export default function LoginPage() {
  const { login, isLoading, setLoading } = useAuthStore();
  const { isOnline } = useSyncStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        login({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [login, setLoading]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      login({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
      });
    } catch (error) {
      console.error('Google Sign-In failed:', error);
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl text-primary animate-pulse">agriculture</span>
          <p className="text-gray-500 mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-surface">
      <div className="text-center mb-12">
        <span className="material-symbols-outlined text-6xl text-primary mb-4">
          agriculture
        </span>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">QuackManager</h1>
        <p className="text-gray-600 text-lg">Your farm, in your pocket.</p>
      </div>

      {!isOnline && (
        <div className="card mb-6 w-full max-w-sm text-center">
          <span className="material-symbols-outlined text-yellow-500 text-3xl mb-2">wifi_off</span>
          <p className="text-sm text-gray-600">No internet connection</p>
          <p className="text-xs text-gray-500 mt-1">Sign-in requires internet. Please connect and try again.</p>
        </div>
      )}

      <button
        onClick={handleGoogleSignIn}
        className="btn-primary flex items-center justify-center gap-3 w-full max-w-sm"
        disabled={!isOnline || isLoading}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Sign in with Google
      </button>

      <p className="text-xs text-gray-500 mt-6 text-center max-w-xs">
        You'll need an internet connection to sign in for the first time. After that, the app works offline.
      </p>
    </div>
  );
}
