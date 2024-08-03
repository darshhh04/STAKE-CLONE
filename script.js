// PANELS

var myPanel = document.getElementById('myPanel');
var notificationPanel = document.getElementById('notificationPanel');
var contactPanel = document.getElementById('contactPanel');
var walletPanel = document.getElementById('walletPanel');

walletPanel.style.display = 'none';

var displayMyPanel = 0;
var displayNotificationPanel = 0;
var displayContactPanel = 0;
var displayWalletPanel = 0;

function show(panel, displayState) {
    if (displayState === 1) {
        panel.style.display = 'block';
        return 0;
    } else {
        panel.style.display = 'none';
        return 1; 
    }
}

document.getElementById('user-btn').addEventListener('click', function() {
    displayMyPanel = show(myPanel, displayMyPanel);
});

document.getElementById('bell-btn').addEventListener('click', function() {
    displayNotificationPanel = show(notificationPanel, displayNotificationPanel);
});

document.getElementById('envelope-btn').addEventListener('click', function() {
    displayContactPanel = show(contactPanel, displayContactPanel);
});

document.getElementById('wallet-btn').addEventListener('click', function() {
    displayWalletPanel = show(walletPanel, displayWalletPanel);
});

document.addEventListener('click', function(event) {
    var isClickInsideMyPanel = myPanel.contains(event.target) || event.target.id === 'user-btn';
    var isClickInsideNotificationPanel = notificationPanel.contains(event.target) || event.target.id === 'bell-btn';
    var isClickInsideContactPanel = contactPanel.contains(event.target) || event.target.id === 'envelope-btn';
    var isClickInsideWalletPanel = walletPanel.contains(event.target) || event.target.id === 'wallet-btn';

    if (!isClickInsideMyPanel) {
        myPanel.style.display = 'none';
        displayMyPanel = 0;
    }
    if (!isClickInsideNotificationPanel) {
        notificationPanel.style.display = 'none';
        displayNotificationPanel = 0;
    }
    if (!isClickInsideContactPanel) {
        contactPanel.style.display = 'none';
        displayContactPanel = 0;
    }
    if (!isClickInsideWalletPanel) {
        walletPanel.style.display = 'none';
        displayWalletPanel = 0;
    }
});

// PANELS

// DEPOSIT & WIDRAWL
var transactionForm = document.getElementById('transaction-form');
var amountInput = document.getElementById('amount-input');
var submitBtn = document.getElementById('submit-btn');
var balanceDisplay = document.getElementById('balance');
var betAmountInput = document.getElementById('bet-amount-input');
var betButton = document.getElementById('bet-button');
var halfButton = document.getElementById('half-btn');
var doubleButton = document.getElementById('double-btn');

// Function to get balance from localStorage or set to 0 if not present
function getBalance() {
    return parseFloat(localStorage.getItem('balance')) || 0;
}

// Function to update balance in localStorage and display
function updateBalance(newBalance) {
    localStorage.setItem('balance', newBalance);
    balanceDisplay.textContent = '₹' + newBalance.toFixed(2);
}

var balance = getBalance(); // Initial balance from localStorage
updateBalance(balance); // Update the display with the initial balance

// Show or hide the transaction form
function toggleTransactionForm() {
    transactionForm.style.display = transactionForm.style.display === 'none' ? 'block' : 'none';
}

// Handle deposit
function deposit(amount) {
    amount = parseFloat(amount);
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid deposit amount!");
        return;
    }
    balance += amount;
    updateBalance(balance); // Update balance display and localStorage
}

function withdraw(amount) {
    amount = parseFloat(amount);
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid withdrawal amount!");
        return;
    }
    if (amount > balance) {
        alert("Insufficient funds!");
        return;
    }
    balance -= amount;
    updateBalance(balance); // Update balance display and localStorage
}

function placeBet(amount) {
    amount = parseFloat(amount);
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid bet amount!");
        return;
    }
    if (amount > balance) {
        alert("Insufficient funds for placing the bet!");
        return;
    }
    balance -= amount;
    updateBalance(balance); // Update balance display and localStorage
}

document.getElementById('deposit-btn').addEventListener('click', function() {
    toggleTransactionForm();
    submitBtn.onclick = function() {
        deposit(amountInput.value);
        amountInput.value = ''; // Clear input field
        toggleTransactionForm();
    };
});

document.getElementById('withdraw-btn').addEventListener('click', function() {
    toggleTransactionForm();
    submitBtn.onclick = function() {
        withdraw(amountInput.value);
        amountInput.value = ''; // Clear input field
        toggleTransactionForm();
    };
});

betButton.addEventListener('click', function() {
    placeBet(betAmountInput.value);
    betAmountInput.value = amount;
});


function updateBetAmountDisplay(amount) {
    betAmountInput.value = amount.toFixed(2);
    betAmountDisplay.textContent = '₹' + amount.toFixed(2);
}

// Function to halve the bet amount
halfButton.addEventListener('click', function() {
    var amount = parseFloat(betAmountInput.value) || 0;
    amount = amount / 2;
    updateBetAmountDisplay(amount);
});

// Function to double the bet amount
doubleButton.addEventListener('click', function() {
    var amount = parseFloat(betAmountInput.value) || 0;
    amount = amount * 2;
    updateBetAmountDisplay(amount);
});

//MINES

const grid = document.querySelector('.grid');
const cells = Array.from(document.querySelectorAll('.cell'));
const mineCountSelect = document.getElementById('mines-select');
const startBetButton = document.getElementById('bet-button'); // Updated variable name
const bettingControls = document.querySelector('.betting-controls');

let minePositions = [];
let revealedCount = 0;
let gameActive = false;

// Initialize the game when the Bet button is clicked
startBetButton.addEventListener('click', () => {
    const betAmount = parseFloat(betAmountInput.value);
    if (isNaN(betAmount) || betAmount <= 0) {
        alert('Please enter a valid bet amount greater than zero.');
        return;
    }
    if (betAmount > balance) {
        alert('Insufficient balance.');
        return;
    }
    if (!gameActive) {
        disableGameOptions(); // Disable options when the game starts
        startGame();
    }
});

// Function to generate random mine positions
function generateMinePositions(count) {
    const positions = new Set();
    while (positions.size < count) {
        positions.add(Math.floor(Math.random() * cells.length));
    }
    return Array.from(positions);
}

// Function to start the game
function startGame() {
    const mineCount = parseInt(mineCountSelect.value);
    minePositions = generateMinePositions(mineCount);
    revealedCount = 0;
    gameActive = true;

    // Reset the grid
    cells.forEach(cell => {
        cell.classList.remove('mine', 'diamond');
        cell.innerHTML = '';
        cell.style.pointerEvents = 'auto';
    });

    // Place mines and diamonds
    minePositions.forEach(position => {
        cells[position].classList.add('mine');
    });

    cells.forEach((cell, index) => {
        if (!minePositions.includes(index)) {
            cell.classList.add('diamond');
        }
    });

    // Enable cell click handling
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick, { once: true });
    });
}

// Function to handle cell click
function handleCellClick(event) {
    if (!gameActive) return;

    const cell = event.target;
    if (cell.classList.contains('mine')) {
        cell.innerHTML = '<img src="mine.png" alt="mine">';
        endGame();
    } else if (cell.classList.contains('diamond')) {
        cell.innerHTML = '<img src="diamond.png" alt="diamond">';
        cell.style.pointerEvents = 'none';
        revealedCount++;
        checkWin();
    }
}

// Function to end the game
function endGame() {
    gameActive = false;
    cells.forEach(cell => {
        cell.style.pointerEvents = 'none';
        if (cell.classList.contains('mine')) {
            cell.innerHTML = '<img src="mine.png" alt="mine">';
        } else if (cell.classList.contains('diamond')) {
            cell.innerHTML = '<img src="diamond.png" alt="diamond">';
        }
    });
    setTimeout(() => {
        enableGameOptions(); // Enable options after the game ends
    }, ); // Adjust the delay as needed
}


// Function to check if the player has won
function checkWin() {
    if (revealedCount === cells.length - minePositions.length) {
        alert('You win!');
        endGame();
    }
}

// Start the game when the Bet button is clicked
betButton.addEventListener('click', function () {
    const betAmount = parseFloat(betAmountInput.value);
  
    if (!gameActive) {
        placeBet(betAmount);
        startGame();
    }
});

//for disabling other option while game is on
const bettingControlDisable = document.querySelector('.betting-controls'); // Add this if you haven't already

function disableGameOptions() {
    bettingControlDisable.style.opacity = 0.5; // Lower the opacity
    const buttons = bettingControlDisable.querySelectorAll('button, select, input');
    buttons.forEach(button => {
        button.disabled = true; // Disable each element
    });
}

function enableGameOptions() {
    bettingControlDisable.style.opacity = 1; // Restore opacity
    const buttons = bettingControlDisable.querySelectorAll('button, select, input'); // Find all interactive elements
    buttons.forEach(button => {
        button.disabled = false; // Enable each element
    });
}




