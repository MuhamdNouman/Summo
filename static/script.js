/* --- Select DOM Elements --- */
const inputText = document.getElementById('inputText');
const summarizeBtn = document.getElementById('summarizeBtn');
const clearBtn = document.getElementById('clearBtn');
const summaryMode = document.getElementById('summaryMode'); 

// Output Section Elements
const outputContainer = document.getElementById('outputContainer');
const outputPlaceholder = document.getElementById('outputPlaceholder');
const loading = document.getElementById('loading');
const resultContent = document.getElementById('resultContent');
const summaryText = document.getElementById('summaryText');
const errorSection = document.getElementById('errorSection');
const errorText = document.getElementById('errorText');
const copyBtn = document.getElementById('copyBtn');
const toast = document.getElementById('toast');

/* --- Main Summarize Function --- */
async function summarize() {
    const text = inputText.value.trim();
    const currentMode = summaryMode.value;
    
    if (!text) {
        showError('Please enter some text to summarize');
        return;
    }
    
    // UI State: Loading
    // 1. Hide Placeholder & Results
    outputPlaceholder.classList.add('hidden');
    resultContent.classList.add('hidden');
    errorSection.classList.add('hidden');
    
    // 2. Show Loader
    loading.classList.remove('hidden');
    
    try {
         const response = await fetch('/summarize', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ 
                text: text, 
                mode: currentMode
             })
        });
        
        const data = await response.json();
        
        // Hide Loader
        loading.classList.add('hidden');
        
        if (data.success) {
            // UI State: Success
            summaryText.innerHTML = formatSummary(data.summary); // Use innerHTML to support bullets if needed
            resultContent.classList.remove('hidden');
        } else {
            showError(data.error || 'Something went wrong');
            // Show placeholder again if it failed
            outputPlaceholder.classList.remove('hidden');
        }
        
    } 
    catch (error) {
        loading.classList.add('hidden');
        showError('Failed to connect to server');
        outputPlaceholder.classList.remove('hidden');
    }

    
}

/* --- Utility Functions --- */

// Optional: Format text if needed (e.g. convert newlines to <br>)
function formatSummary(text) {
    // specific formatting logic can go here if the backend returns raw text
    return text.replace(/\n/g, '<br>'); 
}

// Show Error Message
function showError(message) {
    errorText.textContent = message;
    errorSection.classList.remove('hidden');
    setTimeout(() => {
        errorSection.classList.add('hidden');
    }, 5000);
}

// Clear All Inputs & Reset to Default
function clearAll() {
    inputText.value = '';
    inputText.focus();
    
    // Reset Right Side to "Placeholder" state
    loading.classList.add('hidden');
    resultContent.classList.add('hidden');
    errorSection.classList.add('hidden');
    
    // Show the placeholder again
    outputPlaceholder.classList.remove('hidden');
}

// Copy to Clipboard
function copyToClipboard() {
    const textToCopy = summaryText.innerText;
    
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            showToast("Copied to clipboard!");
            
            // Optional: Change button text temporarily
            const originalText = copyBtn.innerText;
            copyBtn.innerText = 'Copied!';
            setTimeout(() => {
                copyBtn.innerText = originalText;
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy:', err);
            showToast("Failed to copy");
        });
}

// Toast Notification
function showToast(message) {
    toast.innerText = message;
    toast.className = "toast show";
    setTimeout(() => { 
        toast.className = toast.className.replace("show", ""); 
    }, 3000);
}

/* --- Typewriter Effect --- */
const typewriterElement = document.getElementById('typewriter');
if (typewriterElement) { // Safety check
    const phrases = [
        "Turn long reads into quick insights.",
        "Understand anything in seconds.",
        "Summarize Now!"
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 50;
    
    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }
    
        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex++;
            if (phraseIndex === phrases.length) phraseIndex = 0;
            typeSpeed = 500;
        }
    
        setTimeout(typeEffect, typeSpeed);
    }
    
    // Start animation
    document.addEventListener('DOMContentLoaded', typeEffect);
}

/* --- Event Listeners --- */
summarizeBtn.addEventListener('click', summarize);
copyBtn.addEventListener('click', copyToClipboard);
clearBtn.addEventListener('click', clearAll);

// Ctrl+Enter to Submit
inputText.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        summarize();
    }
});