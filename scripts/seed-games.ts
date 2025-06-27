import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Game } from '../lib/types';

const INITIAL_GAMES = [
  {
    name: "Wingspan",
    description: "A competitive, medium-weight, card-driven, engine-building board game from Stonemaier Games. Players are bird enthusiasts seeking to discover and attract the best birds to their wildlife preserves.",
    minPlayers: 1,
    maxPlayers: 5,
    imageUrl: "https://cf.geekdo-images.com/yLZJCVLlIx4c7eJEWUNJ7w__itemrep/img/DR7181wU4sHT6gn6Q1XccpPxBHQ=/fit-in/246x300/filters:strip_icc()/pic4458123.jpg",
  },
  {
    name: "Azul",
    description: "A tile-placement game where players compete to create the most beautiful wall. Inspired by Portuguese tiles called azulejos, players draft tiles and strategically place them to score points.",
    minPlayers: 2,
    maxPlayers: 4,
    imageUrl: "https://cf.geekdo-images.com/tz19PfklMdAdjxV9WArraA__itemrep/img/EuG9Te3VDhT58DlEYeEVVunM5wY=/fit-in/246x300/filters:strip_icc()/pic3718275.jpg",
  },
  {
    name: "Ticket to Ride",
    description: "A railway-themed German-style board game designed by Alan R. Moon. Players collect train cards to build railway routes connecting cities throughout a country or continent.",
    minPlayers: 2,
    maxPlayers: 5,
    imageUrl: "https://cf.geekdo-images.com/ZWJg0dCdrWHxVnc0eFXK8w__itemrep/img/F5t1TuvqshY5O3jLJ8JQPO_xXGs=/fit-in/246x300/filters:strip_icc()/pic38668.jpg",
  },
  {
    name: "Splendor",
    description: "A fast-paced and addictive game of chip-collecting and card development. Players are Renaissance merchants trying to buy gem mines, transportation, shops to acquire the most prestige points.",
    minPlayers: 2,
    maxPlayers: 4,
    imageUrl: "https://cf.geekdo-images.com/rwOMxx4q5yuElIvo-1-OFw__itemrep/img/NaQx3XWoNAOMDGl4AXf4nxlhHo0=/fit-in/246x300/filters:strip_icc()/pic1904079.jpg",
  },
  {
    name: "Catan",
    description: "A multiplayer board game designed by Klaus Teuber. Players assume the roles of settlers establishing colonies on the island of Catan by building settlements, cities, and roads.",
    minPlayers: 3,
    maxPlayers: 4,
    imageUrl: "https://cf.geekdo-images.com/W3Bsga_uLP9kO91gZ7H8yw__itemrep/img/IzYEUm_gWFuRFOL8gQYqGm5gU6A=/fit-in/246x300/filters:strip_icc()/pic2419375.jpg",
  },
  {
    name: "7 Wonders",
    description: "A card development game designed by Antoine Bauza. Players lead ancient civilizations by developing their military, scientific, and cultural aspects through three ages to build architectural wonders.",
    minPlayers: 2,
    maxPlayers: 7,
    imageUrl: "https://cf.geekdo-images.com/RvFVTEpnbb4NM7k0IF8V7A__itemrep/img/F__zhk-OFDgFcMBysW2JlcYJADw=/fit-in/246x300/filters:strip_icc()/pic860217.jpg",
  },
  {
    name: "Pandemic",
    description: "A cooperative game where players work as disease control specialists to save humanity. Players must work together to discover cures for four diseases before they spread out of control.",
    minPlayers: 2,
    maxPlayers: 4,
    imageUrl: "https://cf.geekdo-images.com/S3ybV1LAp-8SnHIXLLjVqA__itemrep/img/oqViRj6nVxK3m36NluUKvQCb8zg=/fit-in/246x300/filters:strip_icc()/pic1534148.jpg",
  },
  {
    name: "Codenames",
    description: "A social word game with a twist. Players split into two teams, competing to see who can make contact with all of their agents first. Spymasters give one-word clues that can point to multiple words on the board.",
    minPlayers: 2,
    maxPlayers: 8,
    imageUrl: "https://cf.geekdo-images.com/F_KDEu0GjdClml8N7c8Imw__itemrep/img/e8zw8YQvQB8q8zH_5H0NI4miqXo=/fit-in/246x300/filters:strip_icc()/pic2582929.jpg",
  },
];

async function seedGames() {
  try {
    console.log('🌱 Starting to seed games...');
    
    for (const gameData of INITIAL_GAMES) {
      const game = {
        ...gameData,
        createdAt: serverTimestamp(),
        createdBy: {
          uid: 'SEED_SCRIPT',
          displayName: 'Seed Script',
        },
        ownedBy: [], // Start with no owners
      };
      
      await addDoc(collection(db, 'games'), game);
      console.log(`✅ Added game: ${game.name}`);
    }
    
    console.log('✨ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding games:', error);
  }
}

// Run the seed function
seedGames(); 