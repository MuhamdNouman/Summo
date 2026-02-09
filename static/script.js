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