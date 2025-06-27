import { collection, doc, addDoc, getDoc, getDocs, updateDoc, query, where, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { Game } from './types';
import type { User } from 'firebase/auth';

const COLLECTION_NAME = 'games';

export async function createGame(
  gameData: Omit<Game, 'id' | 'createdAt' | 'createdBy' | 'ownedBy'>,
  user: User
): Promise<string> {
  if (!user) {
    throw new Error('User must be authenticated to create a game');
  }

  try {
    const game: Omit<Game, 'id'> = {
      ...gameData,
      createdAt: serverTimestamp() as Timestamp,
      createdBy: {
        uid: user.uid,
        displayName: user.displayName,
      },
      ownedBy: [user.uid], // Creator automatically owns the game
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), game);
    return docRef.id;
  } catch (error) {
    console.error('Error creating game:', error);
    throw error;
  }
}

export async function getGame(gameId: string): Promise<Game | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, gameId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Game;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting game:', error);
    throw error;
  }
}

export async function getGames(): Promise<Game[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Game);
  } catch (error) {
    console.error('Error getting games:', error);
    throw error;
  }
}

export async function getUserOwnedGames(userId: string): Promise<Game[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('ownedBy', 'array-contains', userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Game);
  } catch (error) {
    console.error('Error getting user owned games:', error);
    throw error;
  }
}

export async function addGameOwner(gameId: string, userId: string): Promise<void> {
  try {
    const gameRef = doc(db, COLLECTION_NAME, gameId);
    const gameDoc = await getDoc(gameRef);
    
    if (!gameDoc.exists()) {
      throw new Error('Game not found');
    }
    
    const game = gameDoc.data() as Game;
    if (!game.ownedBy.includes(userId)) {
      await updateDoc(gameRef, {
        ownedBy: [...game.ownedBy, userId],
      });
    }
  } catch (error) {
    console.error('Error adding game owner:', error);
    throw error;
  }
}

export async function removeGameOwner(gameId: string, userId: string): Promise<void> {
  try {
    const gameRef = doc(db, COLLECTION_NAME, gameId);
    const gameDoc = await getDoc(gameRef);
    
    if (!gameDoc.exists()) {
      throw new Error('Game not found');
    }
    
    const game = gameDoc.data() as Game;
    await updateDoc(gameRef, {
      ownedBy: game.ownedBy.filter(id => id !== userId),
    });
  } catch (error) {
    console.error('Error removing game owner:', error);
    throw error;
  }
} 