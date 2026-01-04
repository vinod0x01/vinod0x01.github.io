const input = document.getElementById('commandInput');
const output = document.getElementById('terminal-output');
const contentArea = document.getElementById('content-area');
const terminalWrapper = document.getElementById('terminal-wrapper');
const ghostInput = document.getElementById('ghost-input');

// Configuration
let isUserActive = false; // Flag to track if user has taken control
const typeSpeed = 100;    // Speed of typing in ms
const introText = "Should I tell you about Vinod Patil?\nType Yes";

const commands = {
    help: `
<span class="keyword">Please type following options to know more about Vinod Patil:</span>
<span class="highlight">about</span>     - Load About Me section
<span class="highlight">projects</span>  - Load Projects section
<span class="highlight">blogs</span>     - Load Writing section
<span class="highlight">resume</span>    - Load Resume section
<span class="highlight">clear</span>     - Clear terminal
<span class="highlight">contact</span>   - Show contact info`,
    
    contact: `<span class="keyword">LinkedIn:</span> linkedin.com/in/vinod-a-patil/`
};

// --- TYPEWRITER EFFECT ---
let charIndex = 0;
function typeWriter() {
    // Stop if user has already interacted
    if (isUserActive) return;

    if (charIndex < introText.length) {
        ghostInput.textContent += introText.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, typeSpeed);
    }
}

// --- ACTIVATE TERMINAL (Kill Animation) ---
function activateTerminal() {
    if (isUserActive) {
        input.focus(); // Just ensure focus if already active
        return;
    }

    isUserActive = true; // Set flag
    
    // Switch visual styles
    document.querySelector('.input-line').classList.add('input-active');
    
    // Focus real input
    input.focus();
}

// --- CORE FUNCTION: Load Content ---
async function loadPage(pageName) {
    try {
        const response = await fetch(`pages/${pageName}.html`);
        if (!response.ok) throw new Error("Page not found");
        const html = await response.text();
        contentArea.innerHTML = html;

        document.querySelectorAll('nav a').forEach(el => el.classList.remove('active'));
        const navLink = document.getElementById(`nav-${pageName}`);
        if(navLink) navLink.classList.add('active');

        // Only log if it's NOT the initial load
        if(isUserActive) {
            logToTerminal(`System: Loaded module '${pageName}' successfully.`, 'success');
        }

    } catch (error) {
        if(isUserActive) logToTerminal(`Error: Could not load '${pageName}'.`, 'string');
    }
}

// --- TERMINAL LOGIC ---
function logToTerminal(text, type = '') {
    const div = document.createElement('div');
    if (type) div.classList.add(type);
    div.innerHTML = text;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
}

input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const command = input.value.trim().toLowerCase();
        
        logToTerminal(`<span class="prompt">visitor@vinod:~$</span> ${input.value}`);

        if (['about', 'projects', 'blogs', 'resume'].includes(command)) {
            loadPage(command);
        } 
        else if (command === 'clear') {
            output.innerHTML = '';
        }
        else if (commands[command]) {
            logToTerminal(commands[command]);
        }
        else if (command === 'yes' || command === 'y' || command === 'sure' || command === 'ok' || command === 'yeah') {
            logToTerminal(commands['help']);
        }
        else if (command !== '') {
            logToTerminal(`Command not found: '${command}'. Type 'help'.`, 'string');
        }

        input.value = '';
    }
});

// Initialize
window.onload = () => {
    loadPage('about');
    // Start the typewriter effect after a short delay
    setTimeout(typeWriter, 1000); 
};