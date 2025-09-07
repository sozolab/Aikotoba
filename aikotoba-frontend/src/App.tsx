import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChanged, auth } from './lib/firebase';
import { AuthScreen } from './components/AuthScreen';
import { MainApp } from './components/MainApp';
import { Toaster } from './components/ui/sonner';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {user ? <MainApp user={user} /> : <AuthScreen />}
      <Toaster />
    </div>
  );
}

export default App;
