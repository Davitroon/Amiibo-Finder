<h1 align="center">Amiibo Finder</h1>

<p align="center" style="font-style: italic">
Unlock, collect, and manage your favorite Nintendo figures in this Gacha-style Amiibo discovery experience.
</p>

<div align="center">

<img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">

<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white">

<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white">

</div>

---

## 📚 Table of Contents
- [📝 Description](#-description "Learn more about the game's concept and purpose")
- [⚙️ Installation](#️-installation "Instructions to install and run the project locally")
- [🕹️ How to Play](#%EF%B8%8F-how-to-play "Step-by-step guide on how to play the game")
- [🔧 Game Architecture](#-game-architecture "Understand the structure and logic behind the game")
- [🧠 Technologies](#-technologies "See which technologies were used to build the project")
- [🔗 API](#-api "Information about the Truth or Dare API used in this project")

---

## 📝 Description
The core purpose of this application is to simulate the excitement of collecting. Users cannot simply view all Amiibos at once; they must "unlock" them. 

The application persists data locally, allowing users to keep their collection across sessions.

**Key Features**:

- **Gacha System**: Open a mystery gift box to receive a random Amiibo.

- **Cooldown Mechanic**: After opening a gift, a 2-hour timer prevents further unlocks, adding a real-time element to the game.

- **Browser Notifications**: Alerts the user when their cooldown is over and a new gift is ready.

- **Collection Management**: Filter your collection by game series, search by name, or sort by date/favorites.

- **Data Persistence**: Uses localStorage to save the collection and timer state.

- **Import/Export**: Users can backup their collection to a JSON file and restore it later.

- **Theming**: Fully supported Dark/Light mode.

---

## ⚙️ Installation
To run this project locally, ensure you have Node.js installed and run the following commands.


```bash
git clone https://github.com/your-username/amiibo-finder.git

cd amiibo-finder

npm install

npm run dev
```

---

## 🕹️ How to Play
1. **Unlock Page**: Navigate to the "Unlock" tab. If the box is glowing and bouncing, click it to reveal a new Amiibo.

2. **The Wait**: Once unlocked, a timer starts (2 hours). You can leave the app; it will remember your time.

3. **Collection**: Go to the "Collection" tab to view what you have earned.

    - Click the Heart icon to favorite an Amiibo.

    - Use the Filter button to search for specific characters or Game Series (e.g., "Zelda", "Mario").

4. **Settings**: Use the User Menu to toggle Dark Mode or Export your save data.

---

## 🔧 Game Architecture
The application is structured to separate Business Logic from UI Components. It heavily relies on the Context API to avoid prop-drilling and manage global state.

### Provider Hierarchy
The `App.tsx` composes several providers to ensure data is available throughout the tree:

- `ThemeProvider`: Manages visual style (Light/Dark).

- `AmiiboProvider`: The core "database." Handles the list of owned Amiibos, storage persistence, and Import/Export logic.

- `FilterProvider`: Manages the complex state of search inputs, sorting criteria, and active filters.

- `ToastProvider`: A global notification system for user feedback.

### Custom Hooks (`/src/logic`)
Business logic is extracted into reusable hooks:

- `useUnlockLogic`: Handles the countdown timer, the randomization algorithm to ensure you don't get duplicates easily, and API pre-fetching.

- `useFilteredCollection`: Efficiently filters and sorts the user's collection using useMemo to prevent unnecessary re-renders during search.

---

## 🧠 Technologies
Core: React 19, TypeScript

Build Tool: Vite

Routing: React Router DOM v7

Styling: CSS Modules / Vanilla CSS

Icons: React Icons

Effects: React Confetti

Linting: ESLint + TypeScript-ESLint

---

## 🔗 API
This project relies on the external AmiiboAPI to fetch figure data.

- Documentation: https://amiiboapi.com/

- Endpoint Used: `GET /api/amiibo/?type=figure`

The app implements a caching strategy (in `utils.ts`) to download the full Amiibo database only once and store it locally, minimizing network requests and respecting the API's bandwidth.