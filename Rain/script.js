// Get the container for the rain
const rainContainer = document.querySelector('.rain');

// Fire emoji
const fireEmoji = '🔥';

// Parameters for the rain
const fallSpeed = 10; // Speed of the fall (seconds for one fall)

// Array to track the X positions of falling emojis
const emojiPositions = [];

// Function to check if the new emoji will overlap with existing ones
function isOverlap(newX) {
    return emojiPositions.some(existingX => {
        // Ensure a minimum horizontal distance of 40px between emojis
        return Math.abs(newX - existingX) < 40;
    });
}

// Function to create and animate the falling emoji
function createFallingEmoji() {
    const emoji = document.createElement('span');
    emoji.textContent = fireEmoji;
    emoji.classList.add('emoji');

    // Randomize the starting horizontal position of the emoji
    let startX = Math.random() * window.innerWidth; // Random X within screen width

    // Ensure the new emoji doesn't overlap with existing ones
    while (isOverlap(startX)) {
        startX = Math.random() * window.innerWidth; // Adjust X until no overlap
    }

    // Set emoji's starting position
    emoji.style.left = `${startX}px`;
    emoji.style.top = `-30px`; // Start above the viewport

    // Set a consistent fall speed
    const animationDuration = `${fallSpeed + Math.random() * 3}s`; // Randomize fall speed slightly
    emoji.style.animationDuration = animationDuration;

    // Add the emoji to the rain container
    rainContainer.appendChild(emoji);

    // Track this emoji's position to prevent overlap in the future
    emojiPositions.push(startX);

    // Remove the emoji after it finishes falling
    emoji.addEventListener('animationend', () => {
        emoji.remove();

        // Remove the emoji's position from the tracking array
        const index = emojiPositions.indexOf(startX);
        if (index > -1) {
            emojiPositions.splice(index, 1);
        }
    });
}

// Function to continuously create fire emojis
function startRain() {
    setInterval(() => {
        // Randomize the number of emojis to create between 1 and 20
        const numEmojis = Math.floor(Math.random() * 20) + 1; // Random value between 1 and 20

        // Create the number of emojis
        for (let i = 0; i < numEmojis; i++) {
            createFallingEmoji();
        }
    }, 100); // Generate a small burst of emojis every 100ms
}

// Start the emoji rain
startRain();
