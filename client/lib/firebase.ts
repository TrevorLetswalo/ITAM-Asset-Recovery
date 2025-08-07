import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Recovery ticket interface
export interface RecoveryTicket {
  name: string;
  email: string;
  assetTag: string;
  reason: string;
  timestamp: any;
  ticketId: string;
  serialNumber?: string;
  recoveryType?: string;
  comments?: string;
  status: 'pending' | 'in_progress' | 'completed';
}

// Generate unique ticket ID
export const generateTicketId = (): string => {
  const prefix = 'TKT';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

// Submit recovery ticket to Firestore
export const submitRecoveryTicket = async (ticketData: Omit<RecoveryTicket, 'timestamp' | 'ticketId' | 'status'>): Promise<string> => {
  try {
    const ticketId = generateTicketId();
    const ticket: RecoveryTicket = {
      ...ticketData,
      ticketId,
      timestamp: serverTimestamp(),
      status: 'pending'
    };

    await addDoc(collection(db, 'recoveryTickets'), ticket);
    return ticketId;
  } catch (error) {
    console.error('Error submitting recovery ticket:', error);
    throw new Error('Failed to submit recovery ticket');
  }
};
