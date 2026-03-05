# GameHub

A browser-based game hub featuring **Tic Tac Toe** and **Snake**, built with vanilla HTML, CSS, and JavaScript.

## How to Run

No installation or build step required — it's a static web app.

**Option 1 — Open directly in your browser:**
1. Navigate to the `Game/` folder
2. Double-click `index.html`
3. It will open in your default browser

**Option 2 — Use Live Server (recommended for development):**
1. Open the `Game/` folder in VS Code
2. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension
3. Right-click `index.html` → **Open with Live Server**

> No internet connection is needed to play — fonts load from Google Fonts so the typography may fall back to system fonts if offline.

## Games

### Tic Tac Toe
- You are **X** (purple), the CPU is **O** (orange)
- The CPU uses a smart strategy: it will try to win, or block you from winning
- Scores persist across rounds until you refresh the page

### Snake
- Navigate to the **Snake** tab in the navbar
- Press any **arrow key** to start the game
- Use arrow keys to steer; the snake wraps around walls
- Press **P** or the **Pause** button to pause/resume
- The game resets automatically after 3 seconds on Game Over

## File Structure

```
Game/
├── index.html   # App structure and layout
├── styles.css   # All styling and theme
└── script.js    # Game logic for both games
```
