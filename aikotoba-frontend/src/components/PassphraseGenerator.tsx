import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { collection, addDoc, query, where, onSnapshot, orderBy, limit, db } from '../lib/firebase';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { Sparkles, RefreshCw, Users } from 'lucide-react';

interface PassphraseGeneratorProps {
  user: User;
}

interface Passphrase {
  id: string;
  text: string;
  userId: string;
  createdAt: any;
  isActive: boolean;
  matchedWith: string[];
}

export function PassphraseGenerator({ user }: PassphraseGeneratorProps) {
  const [currentPassphrase, setCurrentPassphrase] = useState<Passphrase | null>(null);
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<string[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'passphrases'),
      where('userId', '==', user.uid),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc'),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const data = doc.data() as Omit<Passphrase, 'id'>;
        setCurrentPassphrase({ id: doc.id, ...data });
        setMatches(data.matchedWith || []);
      } else {
        setCurrentPassphrase(null);
        setMatches([]);
      }
    });

    return () => unsubscribe();
  }, [user.uid]);

  const generatePassphrase = async () => {
    setLoading(true);
    try {
      if (currentPassphrase) {
      }

      const passphrases = [
        '桜の花びらが舞い踊る',
        '青い空に白い雲',
        '静かな森の小径',
        '夕日が海を染める',
        '星空の下で語らう',
        '風鈴の音が響く',
        '緑茶の香りが漂う',
        '古い本の匂い',
        '雨上がりの虹',
        '蝶々が花に止まる'
      ];
      
      const randomPassphrase = passphrases[Math.floor(Math.random() * passphrases.length)];

      await addDoc(collection(db, 'passphrases'), {
        text: randomPassphrase,
        userId: user.uid,
        createdAt: new Date(),
        isActive: true,
        matchedWith: []
      });

      toast.success('新しい合言葉を生成しました');
    } catch (error: any) {
      toast.error('合言葉の生成に失敗しました: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2" />
            AI合言葉ジェネレーター
          </CardTitle>
          <CardDescription>
            AIが生成した合言葉で他の参加者とマッチングしましょう
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentPassphrase ? (
            <div className="text-center space-y-4">
              <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200">
                <p className="text-2xl font-bold text-indigo-800 mb-2">
                  "{currentPassphrase.text}"
                </p>
                <p className="text-sm text-gray-600">
                  この合言葉を他の参加者に伝えてマッチングしましょう
                </p>
              </div>
              
              {matches.length > 0 && (
                <div className="flex items-center justify-center space-x-2">
                  <Users className="h-4 w-4 text-green-600" />
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {matches.length}人とマッチング中
                  </Badge>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                まだ合言葉が生成されていません
              </p>
            </div>
          )}
          
          <Button 
            onClick={generatePassphrase} 
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                {currentPassphrase ? '新しい合言葉を生成' : '合言葉を生成'}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>使い方</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-start space-x-2">
            <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
            <p className="text-sm">合言葉を生成します</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
            <p className="text-sm">他の参加者に合言葉を伝えます</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
            <p className="text-sm">同じ合言葉を知っている人同士でマッチングします</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
