const inputText = document.getElementById('inputText');
const summarizeBtn = document.getElementById('summarizeBtn');
const loading = document.getElementById('loading');
const outputSection = document.getElementById('outputSection');
const summaryText = document.getElementById('summaryText');
const errorSection = document.getElementById('errorSection');
const errorText = document.getElementById('errorText');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');

// Summarize function
async function summarize() {
    const text = inputText.value.trim();
    
    if (!text) {
        showError('Please enter some text to summarize');
        return;
    }
    
    // Hide previous results
    hideAll();
    loading.classList.remove('hidden');
    
    try {
        const response = await fetch('/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text })
        });
        
        const data = await response.json();
        
        loading.classList.add('hidden');
        
        if (data.success) {
            summaryText.textContent = data.summary;
            outputSection.classList.remove('hidden');
        } else {
            showError(data.error || 'Something went wrong');
        }
        
    } catch (error) {
        loading.classList.add('hidden');
        showError('Failed to connect to server');
    }
}

// Copy to clipboard
function copyToClipboard() {
    navigator.clipboard.writeText(summaryText.textContent)
        .then(() => {
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = 'Copy';
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy:', err);
        });
}

// Show error
function showError(message) {
    errorText.textContent = message;
    errorSection.classList.remove('hidden');
    setTimeout(() => {
        errorSection.classList.add('hidden');
    }, 5000);
}

// Hide all sections
function hideAll() {
    loading.classList.add('hidden');
    outputSection.classList.add('hidden');
    errorSection.classList.add('hidden');
}

// Event listeners
summarizeBtn.addEventListener('click', summarize);
copyBtn.addEventListener('click', copyToClipboard);

// Enter to submit (Ctrl+Enter)
inputText.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        summarize();
    }
});

// Add this function after the copyToClipboard function

function clearAll() {
    // Clear input
    inputText.value = '';
    
    // Hide all sections
    hideAll();
    
    // Focus back on input
    inputText.focus();
}

// Add this at the bottom with other event listeners

clearBtn.addEventListener('click', clearAll);

// Select the toast element
const toast = document.getElementById('toast');

// New Copy Function with Toast
function copyToClipboard() {
    // Check if there is text to copy
    if (!summaryText.innerText) return;

    navigator.clipboard.writeText(summaryText.innerText)
        .then(() => {
            showToast("Copied to clipboard!");
        })
        .catch(err => {
            console.error('Failed to copy:', err);
            showToast("Failed to copy");
        });
}

// Helper function to show and hide the toast
function showToast(message) {
    toast.innerText = message;
    toast.className = "toast show"; // Add 'show' class to animate in

    // After 3 seconds, remove the show class to animate out
    setTimeout(function(){ 
        toast.className = toast.className.replace("show", ""); 
    }, 3000);
}

/* --- Typewriter Effect Logic --- */

const typewriterElement = document.getElementById('typewriter');

// 1. The Phrases to Rotate (You can edit these lines!)
const phrases = [
    "Turn long reads into quick insights.",
    "Understand anything in seconds.",
    "Summarize Now!"
];

let phraseIndex = 0; // Which phrase are we on?
let charIndex = 0;   // Which character are we on?
let isDeleting = false; // Are we typing or deleting?
let typeSpeed = 25; // Speed of typing

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        // Remove a character
        typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50; // Deleting is faster
    } else {
        // Add a character
        typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100; // Typing is normal speed
    }

    // SCENARIO: Finished Typing
    if (!isDeleting && charIndex === currentPhrase.length) {
        // Pause at the end so user can read it
        isDeleting = true;
        typeSpeed = 2000; // Wait 2 seconds before erasing
    } 
    
    // SCENARIO: Finished Deleting
    else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        // Move to next phrase
        phraseIndex++;
        // If we reached the end of the list, go back to start
        if (phraseIndex === phrases.length) {
            phraseIndex = 0;
        }
        typeSpeed = 500; // Small pause before typing next one
    }

    // Loop the function
    setTimeout(typeEffect, typeSpeed);
}

// Start the animation when page loads
document.addEventListener('DOMContentLoaded', typeEffect);