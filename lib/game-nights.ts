import { collection, doc, addDoc, getDoc, updateDoc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { GameNight, GameNightFormData } from './types';
import type { User } from 'firebase/auth';

const COLLECTION_NAME = 'gameNights';

export async function createGameNight(formData: GameNightFormData, user: User): Promise<string> {
  if (!user) {
    throw new Error('User must be authenticated to create a game night');
  }

  try {
    // Convert date and time strings to Timestamp
    const [year, month, day] = formData.date.split('-').map(Number);
    const [hours, minutes] = formData.time.split(':').map(Number);
    const dateTime = new Date(year, month - 1, day, hours, minutes);
    
    const gameNightData: Omit<GameNight, 'id'> = {
      date: Timestamp.fromDate(dateTime),
      location: formData.location,
      createdAt: serverTimestamp() as Timestamp,
      createdBy: {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
      },
      attendees: {
        [user.uid]: {
          status: 'going',
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
      },
      suggestedGames: {},
      selectedGames: [],
      notes: '',
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), gameNightData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating game night:', error);
    throw error;
  }
}

export async function suggestGame(gameNightId: string, gameId: string, userId: string): Promise<void> {
  if (!gameNightId || !gameId || !userId) {
    throw new Error('Game night ID, game ID, and user ID are required');
  }

  try {
    const gameNightRef = doc(db, COLLECTION_NAME, gameNightId);
    const gameNightDoc = await getDoc(gameNightRef);
    
    if (!gameNightDoc.exists()) {
      throw new Error('Game night not found');
    }
    
    const gameNight = gameNightDoc.data() as GameNight;
    
    // Check if game is already suggested
    if (gameNight.suggestedGames[gameId]) {
      throw new Error('Game already suggested');
    }
    
    // Add the game suggestion
    await updateDoc(gameNightRef, {
      [`suggestedGames.${gameId}`]: {
        suggestedBy: userId,
        votes: [userId], // Suggester automatically votes for their suggestion
      },
    });
  } catch (error) {
    console.error('Error suggesting game:', error);
    throw error;
  }
}

export async function voteForGame(gameNightId: string, gameId: string, userId: string): Promise<void> {
  if (!gameNightId || !gameId || !userId) {
    throw new Error('Game night ID, game ID, and user ID are required');
  }

  try {
    const gameNightRef = doc(db, COLLECTION_NAME, gameNightId);
    const gameNightDoc = await getDoc(gameNightRef);
    
    if (!gameNightDoc.exists()) {
      throw new Error('Game night not found');
    }
    
    const gameNight = gameNightDoc.data() as GameNight;
    const suggestedGame = gameNight.suggestedGames[gameId];
    
    if (!suggestedGame) {
      throw new Error('Game not suggested for this game night');
    }
    
    // Toggle vote
    const votes = suggestedGame.votes || [];
    const hasVoted = votes.includes(userId);
    
    if (hasVoted) {
      // Remove vote
      await updateDoc(gameNightRef, {
        [`suggestedGames.${gameId}.votes`]: votes.filter(id => id !== userId),
      });
    } else {
      // Add vote
      await updateDoc(gameNightRef, {
        [`suggestedGames.${gameId}.votes`]: [...votes, userId],
      });
    }
  } catch (error) {
    console.error('Error voting for game:', error);
    throw error;
  }
}

export async function selectGames(gameNightId: string, gameIds: string[]): Promise<void> {
  if (!gameNightId || !gameIds) {
    throw new Error('Game night ID and game IDs are required');
  }

  try {
    const gameNightRef = doc(db, COLLECTION_NAME, gameNightId);
    await updateDoc(gameNightRef, {
      selectedGames: gameIds,
    });
  } catch (error) {
    console.error('Error selecting games:', error);
    throw error;
  }
} 