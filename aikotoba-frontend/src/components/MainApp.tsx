import { useState } from 'react';
import { User } from 'firebase/auth';
import { signOut, auth } from '../lib/firebase';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { PassphraseGenerator } from './PassphraseGenerator';
import { EventList } from './EventList';
import { MatchHistory } from './MatchHistory';
import { toast } from 'sonner';
import { LogOut, Sparkles, Calendar, History } from 'lucide-react';

interface MainAppProps {
  user: User;
}

export function MainApp({ user }: MainAppProps) {
  const [activeTab, setActiveTab] = useState('passphrase');

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('ログアウトしました');
    } catch (error: any) {
      toast.error('ログアウトに失敗しました: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Sparkles className="h-8 w-8 text-indigo-600 mr-2" />
            <h1 className="text-2xl font-bold text-indigo-600">Aikotoba</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              こんにちは、{user.displayName || user.email}さん
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              ログアウト
            </Button>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="passphrase" className="flex items-center">
              <Sparkles className="h-4 w-4 mr-2" />
              合言葉
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              イベント
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center">
              <History className="h-4 w-4 mr-2" />
              履歴
            </TabsTrigger>
          </TabsList>

          <TabsContent value="passphrase" className="mt-6">
            <PassphraseGenerator user={user} />
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <EventList user={user} />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <MatchHistory user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
