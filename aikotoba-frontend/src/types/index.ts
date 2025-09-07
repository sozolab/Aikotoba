export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: Date;
  lastActive: Date;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  createdBy: string;
  isActive: boolean;
  participants: string[];
}

export interface Passphrase {
  id: string;
  text: string;
  eventId: string;
  userId: string;
  createdAt: Date;
  isActive: boolean;
  matchedWith?: string[];
}

export interface Match {
  id: string;
  users: string[];
  passphrase: string;
  eventId: string;
  createdAt: Date;
  status: 'pending' | 'confirmed' | 'expired';
}
