import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { UserProfile } from './types';
import type { User } from 'firebase/auth';

const COLLECTION_NAME = 'users';

export async function getOrCreateUserProfile(user: User): Promise<UserProfile> {
  if (!user) {
    throw new Error('User must be authenticated to get/create profile');
  }

  try {
    const userRef = doc(db, COLLECTION_NAME, user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Create new profile
      const newProfile: UserProfile = {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        favoriteGameId: null,
        ownedGames: [],
        gameNightsAttended: 0,
      };

      await setDoc(userRef, {
        ...newProfile,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
      });

      return newProfile;
    }

    return userDoc.data() as UserProfile;
  } catch (error) {
    console.error('Error getting/creating user profile:', error);
    throw error;
  }
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<Omit<UserProfile, 'uid' | 'displayName' | 'photoURL'>>
): Promise<void> {
  try {
    const userRef = doc(db, COLLECTION_NAME, userId);
    await updateDoc(userRef, {
      ...updates,
      lastUpdated: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

export async function setFavoriteGame(userId: string, gameId: string | null): Promise<void> {
  return updateUserProfile(userId, { favoriteGameId: gameId });
}

export async function updateOwnedGames(userId: string, gameIds: string[]): Promise<void> {
  return updateUserProfile(userId, { ownedGames: gameIds });
}

export async function incrementGameNightsAttended(userId: string): Promise<void> {
  const userRef = doc(db, COLLECTION_NAME, userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    throw new Error('User profile not found');
  }
  
  const currentCount = (userDoc.data() as UserProfile).gameNightsAttended;
  return updateUserProfile(userId, { gameNightsAttended: currentCount + 1 });
} 