// Get all the letters inside the word container
const letters = document.querySelectorAll('.letter');

// Add an event listener to each letter for the mouse hover effect
letters.forEach(letter => {
    letter.addEventListener('mouseover', () => {
        document.body.style.backgroundColor = getRandomColor(); // Change background on hover
    });
    
    letter.addEventListener('mouseout', () => {
        document.body.style.backgroundColor = '#f4f4f4'; // Reset background when hover ends
    });
});

// Function to generate a random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
