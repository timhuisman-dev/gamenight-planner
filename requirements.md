# 📄 Project Requirements Document  
**Project Name:** Monthly Game Night Organizer  
**Goal:** Build a responsive web app for organizing monthly game nights with friends. Focus on minimal input, high engagement, and playful but clean UX.

---

## 1. Features

### 1.1 Authentication
- Google OAuth login required for interaction
- Non-logged-in users can only view public content

### 1.2 Game Night Management
- Any logged-in user can create a game night with date + time
- Additional details filled in over time by attendees:
  - Location (editable by any attendee)
  - Attendees (via RSVP)
  - Suggested games
  - Votes
  - Final game selection (manual)
  - Notes/comments
- Admin can configure recurrence rule (default: first Wednesday of the month)
- Multiple games can be selected per night

### 1.3 Game Suggestions & Voting
- RSVP’d users can:
  - Suggest 1–3 games from shared catalog
  - Vote on 1–3 suggested games
- Each suggested game shows:
  - Vote count
  - Game owner(s) among attendees
- Final game(s) chosen manually (not auto-selected)

### 1.4 Game Catalog
- All users can view and add to catalog
- Game entry includes:
  - ID
  - Name
  - Description
  - Min/max players

### 1.5 User Profiles
- Google profile pic + name (read-only)
- Editable:
  - Favourite game (from catalog)
  - Games owned (from catalog)
- Game night attendance count

### 1.6 Archive & History
- Public list of past events:
  - Date, time, location
  - Attendees
  - Suggested games + votes
  - Final game(s) played

### 1.7 Notifications
- Push notifications (via Firebase Cloud Messaging)
- Admin can set:
  - Frequency (e.g. X days before)
  - Type (RSVP reminders, game voting reminders)
- “Add to Calendar” button using Google Calendar API

---

## 2. Pages & Components

### 🏠 Dashboard Page
Opened at `/`
- Top navigation bar:
  - Logo
  - Links: Home, Catalog, Archive, Profile, Admin (if applicable)
  - Login/logout button with profile pic
- Layout:
  - Left: “Next Game Night” card
    - Date, time, location
    - RSVP buttons
    - Attendee avatars
    - Top 3 games with votes + ownership
    - “Add to Calendar” and “View Details” buttons
  - Right: Monthly calendar
    - Highlighted dates for upcoming game nights
    - Hover: show # RSVPs and summary
    - Click: opens detail page

---

### 📅 Game Night Detail Page
Opened via:
- “View Details” on dashboard
- Click on calendar block

Sections:
- Date/time + location
- RSVP controls
- Attendee list
- Suggested games (with vote buttons)
- Selected game(s)
- Notes/comments
- “Add to Calendar” button

---

### ➕ Create Game Night Page
Route: `/create`
Form with:
- Date picker
- Time picker
- Optional location
- “Create” button → redirects to detail page

---

### 📚 Game Catalog Page
Route: `/catalog`
- Search bar
- Game cards: name, description, min/max players
- “Add to My Games” toggle
- “Add New Game” button → opens modal/form

---

### 👤 Profile Page
Route: `/profile`
- Google profile picture and name
- Favourite game (dropdown)
- Game nights attended (count)
- Games owned (tag list)
- “Add Game” dropdown
- Logout button

---

### ⚙️ Admin Page
Route: `/admin` (admin only)
Sections:
- **Recurrence**: dropdown to set rule (e.g. first Wednesday)
- **Notifications**:
  - Enable/disable toggle
  - Reminder timing (in days)
  - Reminder type (RSVP, game voting)
- **Moderation**: flagged content placeholder

---

## 3. Access Control

| Action                        | Logged-in Users | Non-logged-in Users |
|------------------------------|-----------------|----------------------|
| View events & calendar       | ✅              | ✅                   |
| RSVP to events               | ✅              | ❌                   |
| Suggest/vote on games        | ✅ (if RSVP’d)  | ❌                   |
| Add/edit game catalog items  | ✅              | ❌                   |
| Edit profile                 | ✅              | ❌                   |
| Create/edit events           | ✅              | ❌                   |

---

## 4. Tech Stack (Suggested)

| Layer         | Technology                |
|---------------|----------------------------|
| Frontend      | Next.js + TailwindCSS      |
| Backend       | Firebase (Auth, Firestore) |
| Auth          | Google OAuth               |
| Hosting       | Vercel or Firebase Hosting |
| Notifications | Firebase Cloud Messaging   |
| Calendar Sync | Google Calendar API        |

---

## 5. Excluded Features

- No RSVP caps
- No vote/suggestion deadlines
- No leaderboard
- No anonymous interaction

