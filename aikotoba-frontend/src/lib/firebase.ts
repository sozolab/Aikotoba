import { mockAuth } from './mockAuth';
import { mockDb } from './mockFirestore';

const USE_MOCK = !import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY === "demo-api-key";

if (USE_MOCK) {
  console.log('🔧 Using mock Firebase services for development');
}

export const auth = mockAuth;
export const db = mockDb;

export async function signInWithEmailAndPassword(auth: any, email: string, password: string) {
  return mockAuth.signInWithEmailAndPassword(email, password);
}

export async function createUserWithEmailAndPassword(auth: any, email: string, password: string) {
  return mockAuth.createUserWithEmailAndPassword(email, password);
}

export async function updateProfile(user: any, profile: { displayName?: string }) {
  return mockAuth.updateProfile(profile);
}

export async function signOut(auth: any) {
  return mockAuth.signOut();
}

export function onAuthStateChanged(auth: any, callback: (user: any) => void) {
  return mockAuth.onAuthStateChanged(callback);
}

export function collection(db: any, name: string) {
  return mockDb.collection(name);
}

export function addDoc(collectionRef: any, data: any) {
  return collectionRef.add(data);
}

export function query(collectionRef: any, ...constraints: any[]) {
  return collectionRef;
}

export function where(field: string, operator: string, value: any) {
  return {};
}

export function orderBy(field: string, direction?: string) {
  return {};
}

export function limit(count: number) {
  return {};
}

export function onSnapshot(ref: any, callback: any) {
  return ref.onSnapshot(callback);
}
