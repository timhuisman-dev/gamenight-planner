import { Timestamp } from 'firebase/firestore';

export interface Game {
  id: string;
  name: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  imageUrl?: string;
  createdAt: Timestamp;
  createdBy: {
    uid: string;
    displayName: string | null;
  };
  ownedBy: string[]; // Array of user IDs who own this game
}

export interface GameNight {
  id: string;
  date: Timestamp;
  location?: string;
  createdAt: Timestamp;
  createdBy: {
    uid: string;
    displayName: string | null;
    photoURL: string | null;
  };
  attendees: {
    [uid: string]: {
      status: 'going' | 'maybe' | 'not-going';
      displayName: string | null;
      photoURL: string | null;
    };
  };
  suggestedGames: {
    [gameId: string]: {
      suggestedBy: string; // user ID
      votes: string[]; // array of user IDs
    };
  };
  selectedGames: string[]; // array of game IDs from the games collection
  notes?: string;
}

export interface GameNightFormData {
  date: string;
  time: string;
  location?: string;
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  favoriteGameId: string | null;
  ownedGames: string[]; // Array of game IDs from the games collection
  gameNightsAttended: number;
} 