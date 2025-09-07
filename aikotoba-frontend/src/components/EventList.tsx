import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { collection, query, onSnapshot, orderBy, db } from '../lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, MapPin, Users } from 'lucide-react';

interface EventListProps {
  user: User;
}

interface Event {
  id: string;
  name: string;
  description: string;
  startDate: any;
  endDate: any;
  location: string;
  participants: string[];
  isActive: boolean;
}

export function EventList({ user }: EventListProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'events'),
      orderBy('startDate', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[];
      
      setEvents(eventsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">イベントを読み込み中...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">現在開催中のイベントはありません</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">開催中のイベント</h2>
        <p className="text-gray-600">参加しているイベントで合言葉を使ってマッチングしましょう</p>
      </div>
      
      {events.map((event) => (
        <Card key={event.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{event.name}</CardTitle>
                <CardDescription className="mt-1">
                  {event.description}
                </CardDescription>
              </div>
              {event.isActive && (
                <Badge className="bg-green-100 text-green-800">開催中</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>
                {event.startDate?.toDate?.()?.toLocaleDateString('ja-JP')} - {' '}
                {event.endDate?.toDate?.()?.toLocaleDateString('ja-JP')}
              </span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{event.location}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2" />
              <span>{event.participants?.length || 0}人が参加中</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
