import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { collection, query, where, onSnapshot, orderBy, db } from '../lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { History, Users, MessageCircle } from 'lucide-react';

interface MatchHistoryProps {
  user: User;
}

interface Match {
  id: string;
  users: string[];
  passphrase: string;
  createdAt: any;
  status: 'pending' | 'confirmed' | 'expired';
}

export function MatchHistory({ user }: MatchHistoryProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'matches'),
      where('users', 'array-contains', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const matchesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Match[];
      
      setMatches(matchesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user.uid]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">確認済み</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">保留中</Badge>;
      case 'expired':
        return <Badge variant="secondary">期限切れ</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">マッチング履歴を読み込み中...</p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">まだマッチング履歴がありません</p>
          <p className="text-sm text-gray-500">
            合言葉を生成して他の参加者とマッチングしてみましょう
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">マッチング履歴</h2>
        <p className="text-gray-600">これまでのマッチング記録を確認できます</p>
      </div>
      
      {matches.map((match) => (
        <Card key={match.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  合言葉: "{match.passphrase}"
                </CardTitle>
                <CardDescription className="mt-1">
                  {match.createdAt?.toDate?.()?.toLocaleString('ja-JP')}
                </CardDescription>
              </div>
              {getStatusBadge(match.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2" />
              <span>{match.users.length}人でマッチング</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
