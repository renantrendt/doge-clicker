// Game state
const game = {
    money: 0,
    clickValue: 1,
    autoClickersActive: false,
    lastTimestamp: 0,
    dogeHasHat: false,
    specialCoinActive: false,
    specialCoinBoostActive: false,
    specialCoinBoostEndTime: 0,
    moonMode: false,
    
    // Achievements system
    achievements: {
        coolHat: false,
        firstMillion: false,
        richerThanElon: false, // 1 quadrillion
        superRich: false,      // 1 quintillion
        moonTrip: false        // 50 quintillion
    },
    
    // Upgrade counts
    dogeMiners: {
        owned: Array(1).fill(0)
    },
    pickaxes: {
        owned: Array(16).fill(0) // Updated to accommodate new pickaxes including Moon pick
    },
    specialAbilities: {
        owned: Array(2).fill(0) // Money Rain and Cool Hat
    },
    boosts: {
        owned: Array(1).fill(0),
        active: Array(1).fill(false),
        timeRemaining: Array(1).fill(0)
    }
};

// Doge miner upgrades configuration
const dogeMinersConfig = [
    { 
        name: "Doge Miner", 
        basePrice: 20, 
        clickPercentIncrease: 10, 
        clickInterval: 2, 
        description: "Clicks automatically every 2 seconds and increases click value by 2%"
    }
];

// Pickaxe upgrades configuration
const pickaxesConfig = [
    // Moon pick - only visible when in moon mode
    { 
        name: "Moon Pick", 
        basePrice: 100e18, // 100QU$
        clickPercentIncrease: 1538, 
        description: "Increases click value by 1538% - Only available on the Moon!",
        moonOnly: true, // This pickaxe is only available on the moon
        image: "86b01fbf7a05ea19165553b3d51b03ef-removebg-preview.png" // Moon pickaxe image
    },
    { 
        name: "Bronze Pickaxe", 
        basePrice: 50, 
        clickPercentIncrease: 10, 
        description: "Increases click value by 10%",
        image: "js/pngtree-pickaxe-vector-isolated-on-white-background-png-image_13774590-removebg-preview.png"
    },
    { 
        name: "Iron Pickaxe", 
        basePrice: 100, 
        clickPercentIncrease: 20, 
        description: "Increases click value by 20%",
        image: "images/ICARUS-Steel-Pickaxe-removebg-preview.png"
    },
    { 
        name: "Gold Pickaxe", 
        basePrice: 170, 
        clickPercentIncrease: 23, 
        description: "Increases click value by 23%",
        image: "images/icon_background-removebg-preview.png"
    },
    { 
        name: "Diamond Pickaxe", 
        basePrice: 500, 
        clickPercentIncrease: 40, 
        description: "Increases click value by 40%"
    },
    { 
        name: "Netherite Pickaxe", 
        basePrice: 700, 
        clickPercentIncrease: 70, 
        description: "Increases click value by 70%"
    },
    { 
        name: "Emerald Pickaxe", 
        basePrice: 1000, 
        clickPercentIncrease: 102, 
        description: "Increases click value by 102%"
    },
    { 
        name: "Lapis Lazuli Pickaxe", 
        basePrice: 30000, 
        clickPercentIncrease: 120, 
        description: "Increases click value by 120%"
    },
    { 
        name: "Dirth Pickaxe", 
        basePrice: 300000, 
        clickPercentIncrease: 200, 
        description: "Increases click value by 200%"
    },
    { 
        name: "French Frie Pickaxe", 
        basePrice: 3300000, 
        clickPercentIncrease: 250, 
        description: "Increases click value by 250%"
    },
    { 
        name: "Potato Pickaxe", 
        basePrice: 8000000, 
        clickPercentIncrease: 300, 
        description: "Increases click value by 300%"
    },
    { 
        name: "Beans Pickaxe", 
        basePrice: 35000000, 
        clickPercentIncrease: 350, 
        description: "Increases click value by 350%"
    },
    { 
        name: "Wooden Pickaxe", 
        basePrice: 40000000, 
        clickPercentIncrease: 400, 
        description: "Increases click value by 400%"
    },
    { 
        name: "Stone Pickaxe", 
        basePrice: 50000000, 
        clickPercentIncrease: 500, 
        description: "Increases click value by 500%"
    },
    { 
        name: "Obsidian Pickaxe", 
        basePrice: 75000000, 
        clickPercentIncrease: 750, 
        description: "Increases click value by 750%"
    },
    { 
        name: "Doge Pickaxe", 
        basePrice: 1000000000000, 
        clickPercentIncrease: 1000, 
        description: "Increases click value by 1000%"
    }
];

// Special abilities configuration
const specialAbilitiesConfig = [
    { 
        name: "Money Rain", 
        basePrice: 100000000000, 
        description: "Generates a random amount of money between 77M$ and 1Q$",
        minMoney: 77000000, // 77 million
        maxMoney: 1000000000000000 // 1 quadrillion
    },
    {
        name: "Cool Hat",
        basePrice: 1,
        description: "Adds a stylish bucket hat to your doge",
        addHat: true,
        requiredMoney: 1000000000000 // 1 trillion dollars required to unlock
    }
];

// Boosts configuration
const boostsConfig = [
    { 
        name: "Speed Boost", 
        basePrice: 300, 
        description: "Miners work 50% faster for 1 minute",
        duration: 60,
        speedMultiplier: 1.5
    }
];

// DOM Elements
const moneyDisplay = document.getElementById('money-display');
const bitcoinButton = document.getElementById('bitcoin-button');
const dogeMinersUpgradesContainer = document.getElementById('doge-miners-upgrades');
const pickaxeUpgradesContainer = document.getElementById('pickaxe-upgrades');
const specialCoinContainer = document.getElementById('special-coin-container');
const specialUpgradesContainer = document.getElementById('special-upgrades');
const boostUpgradesContainer = document.getElementById('boost-upgrades');
const minersDisplay = document.getElementById('miners-display');

// Helper Functions
function formatMoney(amount) {
    if (amount >= 1e33) return Math.floor(amount / 1e33) + ' DEC$';
    if (amount >= 1e30) return Math.floor(amount / 1e30) + ' NO$';
    if (amount >= 1e27) return Math.floor(amount / 1e27) + ' OC$';
    if (amount >= 1e24) return Math.floor(amount / 1e24) + ' SP$';
    if (amount >= 1e21) return Math.floor(amount / 1e21) + ' SE$';
    if (amount >= 1e18) return Math.floor(amount / 1e18) + ' QU$';
    if (amount >= 1e15) return Math.floor(amount / 1e15) + ' Q$';
    if (amount >= 1e12) return Math.floor(amount / 1e12) + ' T$';
    if (amount >= 1e9) return Math.floor(amount / 1e9) + ' B$';
    if (amount >= 1e6) return Math.floor(amount / 1e6) + ' M$';
    if (amount >= 1e3) return Math.floor(amount / 1e3) + ' K$';
    return Math.floor(amount) + '$';
}

function calculateUpgradePrice(basePrice, owned) {
    // For Doge miners, price increases by 20% each time
    if (basePrice === dogeMinersConfig[0].basePrice) {
        return basePrice * Math.pow(1.2, owned);
    }
    // For pickaxes, price doubles for each tier
    return basePrice * Math.pow(2, owned);
}

function updateMoneyDisplay() {
    moneyDisplay.textContent = formatMoney(game.money);
    
    // Check if player has reached 50 quintillion and hasn't gone to the moon yet
    if (game.money >= 50e18 && !game.moonMode && !game.achievements.moonTrip) {
        // Show the moon button in the header
        const moonButton = document.getElementById('moon-button');
        if (moonButton) {
            moonButton.style.display = 'inline-block';
        }
    } else if (game.money < 50e18 && !game.moonMode && !game.achievements.moonTrip) {
        // Hide the moon button if they don't have enough money
        const moonButton = document.getElementById('moon-button');
        if (moonButton) {
            moonButton.style.display = 'none';
        }
        
        // Hide the rocket if they don't have enough money
        const moonTripContainer = document.getElementById('moon-trip-container');
        if (moonTripContainer) {
            moonTripContainer.style.display = 'none';
        }
    }
}

function calculateClickValue() {
    let value = 1; // Base click value
    
    // Apply pickaxe bonuses
    for (let i = 0; i < pickaxesConfig.length; i++) {
        if (game.pickaxes.owned[i] > 0) {
            value *= (1 + pickaxesConfig[i].clickPercentIncrease / 100);
        }
    }
    
    // Apply doge miner bonuses
    for (let i = 0; i < dogeMinersConfig.length; i++) {
        value *= Math.pow(1 + dogeMinersConfig[i].clickPercentIncrease / 100, game.dogeMiners.owned[i]);
    }
    
    // Apply special coin boost if active
    if (game.specialCoinBoostActive) {
        value *= 1.77; // 77% boost
    }
    
    // Apply Cool Hat boost if equipped
    if (game.dogeHasHat) {
        value *= 2; // 100% increase
    }
    
    return value;
}

function incrementMoney(amount) {
    game.money += amount;
    updateMoneyDisplay();
    updateUpgradesAvailability();
    
    // Check for money-based achievements
    checkAchievements();
}

function handleBitcoinClick() {
    const clickValue = calculateClickValue();
    incrementMoney(clickValue);
    
    // Create and show click value animation
    const valueEl = document.createElement('div');
    valueEl.textContent = '+' + formatMoney(clickValue);
    valueEl.classList.add('click-value-animation');
    valueEl.style.left = (Math.random() * 150 + 25) + 'px';
    valueEl.style.top = (Math.random() * 150 + 25) + 'px';
    document.querySelector('.clicker-area').appendChild(valueEl);
    
    setTimeout(() => {
        valueEl.remove();
    }, 1500);
}

function updateUpgradesAvailability() {
    // Update Doge Miners availability
    document.querySelectorAll('.doge-miner-upgrade').forEach((element, index) => {
        const price = calculateUpgradePrice(dogeMinersConfig[index].basePrice, game.dogeMiners.owned[index]);
        
        // Update price display
        element.querySelector('.price').textContent = formatMoney(price);
        
        // Update owned count
        element.querySelector('.owned').textContent = 'Owned: ' + game.dogeMiners.owned[index];
        
        // Update availability
        if (game.money >= price) {
            element.classList.remove('disabled');
        } else {
            element.classList.add('disabled');
        }
    });
    
    // Update Pickaxes availability
    document.querySelectorAll('.pickaxe-upgrade').forEach((element, index) => {
        // Check if this is a moon-only pickaxe
        if (pickaxesConfig[index].moonOnly) {
            // Only show moon pickaxes when in moon mode
            if (!game.moonMode) {
                element.style.display = 'none';
                return;
            }
        } else if (index > 0) {
            // For non-moon pickaxes, show next pickaxe only if the previous one is owned
            // Skip index 0 check if it's a moon pickaxe
            const prevIndex = pickaxesConfig[index-1].moonOnly ? index-2 : index-1;
            if (prevIndex >= 0 && game.pickaxes.owned[prevIndex] === 0) {
                element.style.display = 'none';
                return;
            }
        }
        
        element.style.display = 'block';
        
        // If already owned, show as owned
        if (game.pickaxes.owned[index] > 0) {
            element.classList.add('owned-upgrade');
            element.querySelector('.price').textContent = 'Purchased';
            return;
        }
        
        const price = calculateUpgradePrice(pickaxesConfig[index].basePrice, game.pickaxes.owned[index]);
        
        // Update price display
        element.querySelector('.price').textContent = formatMoney(price);
        
        // Update availability
        if (game.money >= price) {
            element.classList.remove('disabled');
        } else {
            element.classList.add('disabled');
        }
    });
    
    // Update Special Abilities availability
    document.querySelectorAll('.special-ability-upgrade').forEach((element, index) => {
        const ability = specialAbilitiesConfig[index];
        
        // Check if this ability has a money requirement
        if (ability.requiredMoney) {
            if (game.money >= ability.requiredMoney) {
                element.classList.remove('locked');
                element.querySelector('.lock-icon')?.remove();
                element.querySelector('.unlock-requirement')?.remove();
            } else {
                element.classList.add('locked');
            }
        }
        
        // Calculate price (for Money Rain, it increases by 7x each time)
        let price;
        if (index === 0) { // Money Rain
            price = ability.basePrice * Math.pow(7, game.specialAbilities.owned[index]);
        } else {
            price = ability.basePrice;
        }
        
        // Update price display
        element.querySelector('.price').textContent = formatMoney(price);
        
        // Update availability based on price
        if (game.money >= price && (!ability.requiredMoney || game.money >= ability.requiredMoney)) {
            element.classList.remove('disabled');
        } else {
            element.classList.add('disabled');
        }
    });
}

function buyDogeUpgrade(index) {
    const price = calculateUpgradePrice(dogeMinersConfig[index].basePrice, game.dogeMiners.owned[index]);
    
    if (game.money >= price) {
        game.money -= price;
        game.dogeMiners.owned[index]++;
        updateMoneyDisplay();
        updateUpgradesAvailability();
        
        // Add a doge miner image to the display
        addDogeMinersToDisplay();
        
        // Start auto-clickers if not already started
        if (!game.autoClickersActive) {
            startAutoClickers();
        }
    }
}

function buyPickaxeUpgrade(index) {
    const price = calculateUpgradePrice(pickaxesConfig[index].basePrice, game.pickaxes.owned[index]);
    
    if (game.money >= price && game.pickaxes.owned[index] === 0) {
        game.money -= price;
        game.pickaxes.owned[index] = 1;
        updateMoneyDisplay();
        updateUpgradesAvailability();
        game.clickValue = calculateClickValue();
    }
}

function buySpecialAbility(index) {
    const ability = specialAbilitiesConfig[index];
    let price;
    
    // For Money Rain, calculate price based on how many times it's been purchased
    if (index === 0) { // Money Rain
        price = ability.basePrice * Math.pow(7, game.specialAbilities.owned[index]);
    } else {
        price = ability.basePrice;
    }
    
    // Check if this ability has a money requirement and if the player meets it
    if (ability.requiredMoney && game.money < ability.requiredMoney) {
        return; // Cannot buy if the required money threshold is not met
    }
    
    if (game.money >= price) {
        // Deduct money
        game.money -= price;
        
        // Increment owned count
        game.specialAbilities.owned[index]++;
        
        // Update displays
        updateMoneyDisplay();
        createSpecialAbilitiesUpgradeElements();
        
        // Apply special ability effect
        activateSpecialAbility(index);
    }
}

function activateSpecialAbility(index) {
    const ability = specialAbilitiesConfig[index];
    
    switch(index) {
        case 0: // Money Rain
            // Generate a random amount between minMoney and maxMoney
            const randomAmount = Math.random() * (ability.maxMoney - ability.minMoney) + ability.minMoney;
            incrementMoney(randomAmount);
            break;
            
        case 1: // Cool Hat
            if (game.money >= 1000000000000) {
                game.dogeHasHat = true;
                
                // Check for Cool Hat achievement
                if (!game.achievements.coolHat) {
                    unlockAchievement('coolHat', 'Cool Hat', 'You bought the Cool Hat!');
                }
            }
            
            // Add a hat to the doge
            if (game.dogeHasHat) {
                // Update the Bitcoin image to show a hat
                const bitcoinImg = document.getElementById('bitcoin-img');
                const hatImg = document.createElement('img');
                hatImg.src = '12664-8939-cooling-bucket-hat-black-back-removebg-preview.png';
                hatImg.alt = 'Cool Bucket Hat';
                hatImg.style.position = 'absolute';
                hatImg.style.top = '-50px';
                hatImg.style.left = '50%';
                hatImg.style.transform = 'translateX(-50%)';
                hatImg.style.width = '120px';
                hatImg.style.zIndex = '10';
                hatImg.id = 'doge-hat';
                
                // Only add the hat if it doesn't already exist
                if (!document.getElementById('doge-hat')) {
                    bitcoinImg.parentElement.style.position = 'relative';
                    bitcoinImg.parentElement.appendChild(hatImg);
                }
            }
            break;
    }
}

function buyBoost(index) {
    const boost = boostsConfig[index];
    const price = boost.basePrice;
    
    if (game.money >= price) {
        // Deduct money
        game.money -= price;
        
        // Increment owned count
        game.boosts.owned[index]++;
        
        // Update displays
        updateMoneyDisplay();
        createBoostUpgradeElements();
        
        // Apply boost effect
        activateBoost(index);
    }
}

function activateBoost(index) {
    const boost = boostsConfig[index];
    
    // Mark boost as active
    game.boosts.active[index] = true;
    game.boosts.timeRemaining[index] = boost.duration;
    
    // Apply specific boost effects
    switch(index) {
        case 0: // Speed Boost
            console.log('Speed Boost activated for ' + boost.duration + ' seconds');
            // The effect is applied in the calculateAutoClickerValue function
            break;
    }
    
    // Start a timer to update the boost time remaining
    const boostTimer = setInterval(() => {
        game.boosts.timeRemaining[index]--;
        
        if (game.boosts.timeRemaining[index] <= 0) {
            game.boosts.active[index] = false;
            clearInterval(boostTimer);
            console.log(`${boost.name} has expired`);
        }
    }, 1000);
}

function createDogeUpgradeElements() {
    dogeMinersUpgradesContainer.innerHTML = '';
    
    dogeMinersConfig.forEach((upgrade, index) => {
        const upgradeElement = document.createElement('div');
        upgradeElement.classList.add('upgrade-item', 'doge-miner-upgrade');
        
        upgradeElement.innerHTML = `
            <h4>${upgrade.name}</h4>
            <div class="price">${formatMoney(upgrade.basePrice)}</div>
            <div class="description">${upgrade.description}</div>
            <div class="owned">Owned: 0</div>
        `;
        
        upgradeElement.addEventListener('click', () => buyDogeUpgrade(index));
        
        dogeMinersUpgradesContainer.appendChild(upgradeElement);
    });
}

function createPickaxeUpgradeElements() {
    pickaxeUpgradesContainer.innerHTML = '';
    
    pickaxesConfig.forEach((upgrade, index) => {
        const upgradeElement = document.createElement('div');
        upgradeElement.classList.add('upgrade-item', 'pickaxe-upgrade');
        
        // Hide all pickaxes except the first one initially
        if (index > 0) {
            upgradeElement.style.display = 'none';
        }
        
        // Add special styling based on pickaxe type
        if (upgrade.moonOnly) {
            upgradeElement.classList.add('moon-only-upgrade');
            // Add moon-themed black and blue background
            upgradeElement.style.background = 'linear-gradient(135deg, #0f0f29 0%, #1e2a4a 50%, #2a3c62 100%)';
            upgradeElement.style.boxShadow = '0 0 12px rgba(100, 180, 255, 0.7)';
            upgradeElement.style.border = '1px solid #64b4ff';
            // Make text more visible on dark background
            upgradeElement.style.color = '#ffffff';
        } else if (upgrade.name === 'Bronze Pickaxe') {
            // Add bronze-themed background
            upgradeElement.style.background = 'linear-gradient(135deg, #cd7f32 0%, #e6b17f 50%, #ffd700 100%)';
            upgradeElement.style.boxShadow = '0 0 8px rgba(205, 127, 50, 0.7)';
            upgradeElement.style.border = '1px solid #b87333';
            upgradeElement.style.color = '#000000';
        } else if (upgrade.name === 'Gold Pickaxe') {
            // Add gold-themed background
            upgradeElement.style.background = 'linear-gradient(135deg, #ffd700 0%, #ffec8b 50%, #fffacd 100%)';
            upgradeElement.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.8)';
            upgradeElement.style.border = '1px solid #daa520';
            upgradeElement.style.color = '#000000';
        } else if (upgrade.name === 'Iron Pickaxe') {
            // Add cool metallic background for Iron Pickaxe
            upgradeElement.style.background = 'linear-gradient(135deg, #777777 0%, #aaaaaa 50%, #cccccc 100%)';
            upgradeElement.style.boxShadow = '0 0 8px rgba(150, 150, 150, 0.8)';
            upgradeElement.style.border = '1px solid #888888';
            upgradeElement.style.color = '#000000';
        }
        
        // Add image if available
        let imageHtml = '';
        if (upgrade.image) {
            imageHtml = `<img src="${upgrade.image}" alt="${upgrade.name}" class="upgrade-image" style="max-width: 40px; max-height: 40px; margin-bottom: 5px; display: inline-block; float: left; margin-right: 10px;">`;
        }
        
        upgradeElement.innerHTML = `
            <div style="display: flex; align-items: center;">
                ${imageHtml}
                <div>
                    <h4>${upgrade.name}</h4>
                    <div class="price">${formatMoney(upgrade.basePrice)}</div>
                    <div class="description">${upgrade.description}</div>
                </div>
            </div>
        `;
        
        upgradeElement.addEventListener('click', () => buyPickaxeUpgrade(index));
        
        pickaxeUpgradesContainer.appendChild(upgradeElement);
    });
}

function createSpecialAbilitiesUpgradeElements() {
    specialUpgradesContainer.innerHTML = '';
    
    specialAbilitiesConfig.forEach((upgrade, index) => {
        const upgradeElement = document.createElement('div');
        upgradeElement.classList.add('upgrade-item', 'special-ability-upgrade');
        
        // Check if this is the Cool Hat and if the player has enough money to unlock it
        const isLocked = upgrade.requiredMoney && game.money < upgrade.requiredMoney;
        
        if (isLocked) {
            upgradeElement.classList.add('locked');
        }
        
        // Calculate price (for Money Rain, it increases by 7x each time)
        let price;
        if (index === 0) { // Money Rain
            price = upgrade.basePrice * Math.pow(7, game.specialAbilities.owned[index]);
        } else {
            price = upgrade.basePrice;
        }
        
        upgradeElement.innerHTML = `
            <h4>${upgrade.name}${isLocked ? ' <span class="lock-icon">🔒</span>' : ''}</h4>
            <div class="price">${formatMoney(price)}</div>
            <div class="description">${upgrade.description}</div>
            <div class="owned">Owned: ${game.specialAbilities.owned[index]}</div>
            ${isLocked ? `<div class="unlock-requirement">Unlocks at: ${formatMoney(upgrade.requiredMoney)}</div>` : ''}
        `;
        
        upgradeElement.addEventListener('click', () => buySpecialAbility(index));
        
        specialUpgradesContainer.appendChild(upgradeElement);
    });
}

function createBoostUpgradeElements() {
    boostUpgradesContainer.innerHTML = '';
    
    boostsConfig.forEach((upgrade, index) => {
        const upgradeElement = document.createElement('div');
        upgradeElement.classList.add('upgrade-item', 'boost-upgrade');
        
        upgradeElement.innerHTML = `
            <h4>${upgrade.name}</h4>
            <div class="price">${formatMoney(upgrade.basePrice)}</div>
            <div class="description">${upgrade.description}</div>
            <div class="owned">Owned: ${game.boosts.owned[index]}</div>
        `;
        
        upgradeElement.addEventListener('click', () => buyBoost(index));
        
        boostUpgradesContainer.appendChild(upgradeElement);
    });
}

function processAutoClickers(timestamp) {
    if (!game.lastTimestamp) {
        game.lastTimestamp = timestamp;
    }
    
    const deltaTime = timestamp - game.lastTimestamp;
    game.lastTimestamp = timestamp;
    
    // Check if special coin boost has expired
    if (game.specialCoinBoostActive && Date.now() > game.specialCoinBoostEndTime) {
        game.specialCoinBoostActive = false;
        console.log('Special coin boost expired');
    }
    
    // Process each auto-clicker
    dogeMinersConfig.forEach((config, index) => {
        const ownedCount = game.dogeMiners.owned[index];
        
        if (ownedCount > 0) {
            let interval = config.clickInterval * 1000; // Convert to milliseconds
            
            // Apply Speed Boost if active
            if (game.boosts.active[0]) { // Speed Boost is at index 0
                interval /= boostsConfig[0].speedMultiplier; // Make miners work faster
            }
            
            const clicksPerFrame = (deltaTime / interval) * ownedCount;
            let clickValue = calculateClickValue();
            
            // The salary multiplier is already included in calculateClickValue()
            // Special coin boost is also included in calculateClickValue()
            
            // Add partial clicks to the money
            incrementMoney(clickValue * clicksPerFrame);
        }
    });
    
    requestAnimationFrame(processAutoClickers);
}

function startAutoClickers() {
    game.autoClickersActive = true;
    game.lastTimestamp = 0;
    requestAnimationFrame(processAutoClickers);
}

// Setup Bitcoin image and animations
function setupBitcoinImage() {
    const style = document.createElement('style');
    style.textContent = `
        #bitcoin-img {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            position: relative;
            object-fit: cover;
        }
        
        .click-value-animation {
            position: absolute;
            color: #2ecc71;
            font-weight: bold;
            font-size: 20px;
            pointer-events: none;
            animation: floatUp 1.5s ease-out;
            opacity: 0;
        }
        
        @keyframes floatUp {
            0% {
                transform: translateY(0);
                opacity: 1;
            }
            100% {
                transform: translateY(-100px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Keep the img element, just ensure it has the right src
    const bitcoinImg = document.getElementById('bitcoin-img');
    if (bitcoinImg.tagName.toLowerCase() !== 'img') {
        // If somehow it's not an img (shouldn't happen), fix it
        const parent = bitcoinImg.parentElement;
        const newElement = document.createElement('img');
        newElement.id = 'bitcoin-img';
        newElement.src = 'download.jpeg';
        newElement.alt = 'Bitcoin';
        parent.replaceChild(newElement, bitcoinImg);
    } else {
        // Ensure the image has the right src
        bitcoinImg.src = 'download.jpeg';
    }
}

// Initialization
function initGame() {
    // Create upgrade elements
    createDogeUpgradeElements();
    createPickaxeUpgradeElements();
    createSpecialAbilitiesUpgradeElements();
    createBoostUpgradeElements();
    
    // Load saved game if exists
    loadGame();
    
    // Add event listener to bitcoin button
    bitcoinButton.addEventListener('click', handleBitcoinClick);
    
    // Add temporary Bitcoin styling
    setupBitcoinImage();
    
    // Apply moon mode if active
    if (game.moonMode || game.achievements.moonTrip) {
        document.body.style.backgroundImage = 'url("jrt0bgtf4vi61.jpg")';
        const bitcoinImg = document.getElementById('bitcoin-img');
        bitcoinImg.src = 'DogeMoon-removebg-preview.png';
        
        // Hide the rocket and moon button if moon mode is already active
        const moonTripContainer = document.getElementById('moon-trip-container');
        if (moonTripContainer) {
            moonTripContainer.style.display = 'none';
        }
        
        const moonButton = document.getElementById('moon-button');
        if (moonButton) {
            moonButton.style.display = 'none';
        }
    }
    
    // Initial UI updates
    updateMoneyDisplay();
    updateUpgradesAvailability();
    
    // Check if player has 50QU$ or more when the game loads
    if (game.money >= 50e18 && !game.moonMode && !game.achievements.moonTrip) {
        // Show the moon button in the header
        const moonButton = document.getElementById('moon-button');
        if (moonButton) {
            moonButton.style.display = 'inline-block';
        }
    }
    
    // Debug moon button removed
    
    // Add Earth button functionality to the Doge image in header
    const earthButton = document.getElementById('earth-button');
    if (earthButton) {
        earthButton.addEventListener('click', function() {
            // Only return to Earth if in moon mode
            if (game.moonMode) {
                returnToEarth();
            }
        });
    }
    
    // Add Moon button functionality
    const moonButton = document.getElementById('moon-button');
    if (moonButton) {
        moonButton.addEventListener('click', function() {
            // Only go to Moon if not in moon mode and have enough money
            if (!game.moonMode && game.money >= 50e18) {
                goToMoon();
            }
        });
    }
    
    // Load any existing doge miners
    addDogeMinersToDisplay();
    
    // Save game every minute
    setInterval(saveGame, 60000);
    
    // Start special coin spawning (every 2 minutes)
    startSpecialCoinSpawning();
    
    // Set up achievements popup
    setupAchievements();
    
    // Load saved game data if available
    loadGame();
    
    // Check achievements after loading
    checkAchievements();
}

// Achievements system
function setupAchievements() {
    console.log('Setting up achievements');
    // Set up achievements popup button
    const achievementsButton = document.getElementById('achievements-button');
    const achievementsPopup = document.getElementById('achievements-popup');
    const closePopupBtn = document.querySelector('.close-popup');
    
    if (!achievementsButton || !achievementsPopup || !closePopupBtn) {
        console.error('Achievement elements not found');
        return;
    }
    
    console.log('Adding event listeners');
    achievementsButton.addEventListener('click', function() {
        console.log('Achievement button clicked');
        updateAchievementsDisplay();
        achievementsPopup.style.display = 'block';
    });
    
    closePopupBtn.addEventListener('click', function() {
        achievementsPopup.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === achievementsPopup) {
            achievementsPopup.style.display = 'none';
        }
    });
}

function checkAchievements() {
    // Check for Cool Hat achievement
    if (game.dogeHasHat && !game.achievements.coolHat) {
        unlockAchievement('coolHat', 'Cool Hat', 'You bought the Cool Hat!');
    }
    
    // Check for first million achievement
    if (game.money >= 1000000 && !game.achievements.firstMillion) {
        unlockAchievement('firstMillion', 'Your 1st M :)))', 'You earned your first million dollars!');
    }
    
    // Check for richer than Elon achievement (1 quadrillion)
    if (game.money >= 1000000000000000 && !game.achievements.richerThanElon) {
        unlockAchievement('richerThanElon', 'Congrats! you are richer than Elon Musk', 'You earned more than 1 quadrillion dollars!');
    }
    
    // Check for super rich achievement (1 quintillion)
    if (game.money >= 1000000000000000000 && !game.achievements.superRich) {
        unlockAchievement('superRich', 'Bro you are sooo rich :)) give me some milions plsss?', 'You earned more than 1 quintillion dollars!');
    }
}

function unlockAchievement(id, title, description) {
    // Mark achievement as unlocked
    game.achievements[id] = true;
    
    // Show notification
    showAchievementNotification(title, description);
    
    // Update display
    updateAchievementsDisplay();
    
    // Save game to persist achievement
    saveGame();
}

function showAchievementNotification(title, description) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-notification-icon">🏆</div>
        <div class="achievement-notification-text">
            <h3>Achievement Unlocked!</h3>
            <p>${title}</p>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Set opacity to 1 to trigger animation
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 5000);
}

function updateAchievementsDisplay() {
    // Update each achievement in the popup
    document.getElementById('achievement-cool-hat').classList.toggle('unlocked', game.achievements.coolHat);
    document.getElementById('achievement-first-million').classList.toggle('unlocked', game.achievements.firstMillion);
    document.getElementById('achievement-richer-than-elon').classList.toggle('unlocked', game.achievements.richerThanElon);
    document.getElementById('achievement-super-rich').classList.toggle('unlocked', game.achievements.superRich);
}

// Save and Load game
function saveGame() {
    // Create a copy of the game state to save
    const saveData = {...game};
    
    // Add timestamp for special coin boost end time
    saveData.specialCoinBoostEndTime = game.specialCoinBoostEndTime;
    
    // Ensure moonMode is saved
    saveData.moonMode = game.moonMode;
    
    localStorage.setItem('dogeClickerSave', JSON.stringify(saveData));
}

function loadGame() {
    const savedGame = localStorage.getItem('dogeClickerSave');
    
    if (savedGame) {
        const loadedGame = JSON.parse(savedGame);
        
        // Apply saved data to current game
        game.money = loadedGame.money || 0;
        game.clickValue = loadedGame.clickValue || 1;
        game.dogeHasHat = loadedGame.dogeHasHat || false;
        game.moonMode = loadedGame.moonMode || false;
        
        // Load special coin boost state
        if (loadedGame.specialCoinBoostActive) {
            game.specialCoinBoostActive = loadedGame.specialCoinBoostActive;
            game.specialCoinBoostEndTime = loadedGame.specialCoinBoostEndTime || 0;
            
            // If the boost should still be active
            if (game.specialCoinBoostActive && Date.now() > game.specialCoinBoostEndTime) {
                game.specialCoinBoostActive = false;
            }
        }
        
        // Load upgrade ownerships
        if (loadedGame.dogeMiners && loadedGame.dogeMiners.owned) {
            game.dogeMiners.owned = loadedGame.dogeMiners.owned;
        }
        
        if (loadedGame.pickaxes && loadedGame.pickaxes.owned) {
            // Ensure we have enough slots for all pickaxes
            while (game.pickaxes.owned.length < 15) {
                game.pickaxes.owned.push(0);
            }
            
            // Copy saved pickaxes data
            for (let i = 0; i < loadedGame.pickaxes.owned.length; i++) {
                game.pickaxes.owned[i] = loadedGame.pickaxes.owned[i];
            }
        }
        
        // Load special abilities
        if (loadedGame.specialAbilities && loadedGame.specialAbilities.owned) {
            // Ensure we have enough slots for all abilities
            while (game.specialAbilities.owned.length < 2) {
                game.specialAbilities.owned.push(0);
            }
            
            // Map old indices to new indices
            // Old: [0=DoubleClick, 1=MoneyRain, 2=BetterSalary]
            // New: [0=MoneyRain, 1=BetterSalary]
            if (loadedGame.specialAbilities.owned.length > 2) {
                // Money Rain was at index 1, now at index 0
                game.specialAbilities.owned[0] = loadedGame.specialAbilities.owned[1];
                // Better Salary was at index 2, now at index 1
                game.specialAbilities.owned[1] = loadedGame.specialAbilities.owned[2];
            } else {
                // For newer saves that might already have the correct structure
                for (let i = 0; i < loadedGame.specialAbilities.owned.length && i < 2; i++) {
                    game.specialAbilities.owned[i] = loadedGame.specialAbilities.owned[i];
                }
            }
        }
        
        // Add the hat if the user has it
        if (game.dogeHasHat) {
            setTimeout(() => {
                const bitcoinImg = document.getElementById('bitcoin-img');
                const hatImg = document.createElement('img');
                hatImg.src = '12664-8939-cooling-bucket-hat-black-back-removebg-preview.png';
                hatImg.alt = 'Cool Bucket Hat';
                hatImg.style.position = 'absolute';
                hatImg.style.top = '-50px';
                hatImg.style.left = '50%';
                hatImg.style.transform = 'translateX(-50%)';
                hatImg.style.width = '120px';
                hatImg.style.zIndex = '10';
                hatImg.id = 'doge-hat';
                
                // Only add the hat if it doesn't already exist
                if (!document.getElementById('doge-hat')) {
                    bitcoinImg.parentElement.style.position = 'relative';
                    bitcoinImg.parentElement.appendChild(hatImg);
                }
            }, 500); // Small delay to ensure the bitcoin image is loaded
        }
        
        // Add doge miners to display based on saved count
        addDogeMinersToDisplay();
        
        // Start auto-clickers if any are owned
        if (game.dogeMiners.owned.some(count => count > 0) && !game.autoClickersActive) {
            startAutoClickers();
        }
        
        // Update UI
        updateMoneyDisplay();
        updateUpgradesAvailability();
    }
}

// Function to add doge miners to the display
function addDogeMinersToDisplay() {
    // Clear existing miners
    minersDisplay.innerHTML = '';
    
    // Get total number of doge miners owned
    const totalMiners = game.dogeMiners.owned.reduce((total, count) => total + count, 0);
    console.log('Total miners owned:', totalMiners); // Debug log
    
    // Add a test miner if none are owned yet (for debugging)
    if (totalMiners === 0) {
        // Force add one miner for testing
        game.dogeMiners.owned[0] = 1;
        console.log('Added a test miner for debugging');
    }
    
    // Recalculate after potential debug addition
    const displayMiners = game.dogeMiners.owned.reduce((total, count) => total + count, 0);
    console.log('Displaying miners:', displayMiners); // Debug log
    
    // Get the container width to determine wrapping
    const containerWidth = document.querySelector('.upgrades-container').offsetWidth;
    const containerHeight = document.querySelector('.clicker-area').offsetHeight;
    const maxXPos = containerWidth / 2 - 30; // Maximum X position before wrapping
    const maxYPos = containerHeight / 2 - 30; // Maximum Y position before wrapping
    
    // Add a miner image for each owned miner
    for (let i = 0; i < displayMiners; i++) {
        const minerImg = document.createElement('img');
        // Use absolute path to ensure image loads
        minerImg.src = './doge-coin-miner-game-removebg-preview.png';
        minerImg.alt = 'Doge Miner';
        minerImg.classList.add('doge-miner');
        
        // Add an onerror handler to log if image fails to load
        minerImg.onerror = function() {
            console.error('Failed to load miner image');
        };
        
        // Calculate position with wrapping to new line
        const minersPerColumn = 5; // Number of miners per column before wrapping
        const columnIndex = Math.floor(i / minersPerColumn);
        const rowIndex = i % minersPerColumn;
        
        // Calculate initial position
        let xPos = 120 + (columnIndex * 25); // Horizontal spacing between columns
        let yPos = -50 + (rowIndex * 20); // Vertical spacing between miners
        
        // Wrap to the other side if out of bounds
        if (xPos > maxXPos) {
            xPos = -maxXPos + (xPos % maxXPos);
        } else if (xPos < -maxXPos) {
            xPos = maxXPos - (Math.abs(xPos) % maxXPos);
        }
        
        if (yPos > maxYPos) {
            yPos = -maxYPos + (yPos % maxYPos);
        } else if (yPos < -maxYPos) {
            yPos = maxYPos - (Math.abs(yPos) % maxYPos);
        }
        
        minerImg.style.left = `calc(50% + ${xPos}px)`;
        minerImg.style.top = `calc(50% + ${yPos}px)`;
        
        // Add a random animation delay for each miner
        minerImg.style.animationDelay = `${Math.random() * 2}s`;
        
        minersDisplay.appendChild(minerImg);
        console.log('Added miner', i+1, 'of', displayMiners); // Debug log
    }
}

// Functions for the special coin that appears every 2 minutes
function startSpecialCoinSpawning() {
    // First spawn after 10 seconds (for testing), then every 2 minutes
    setTimeout(() => {
        spawnSpecialCoin();
        setInterval(spawnSpecialCoin, 2 * 60 * 1000); // 2 minutes
    }, 10 * 1000);
}

function spawnSpecialCoin() {
    // Don't spawn if a special coin is already active
    if (game.specialCoinActive) return;
    
    // Create the special coin element
    const specialCoin = document.createElement('img');
    specialCoin.src = '3811742d9ef94f6bb29795541070e951-removebg-preview.png';
    specialCoin.alt = 'Special Coin';
    specialCoin.classList.add('special-coin');
    
    // Position randomly within the container
    const containerWidth = specialCoinContainer.offsetWidth;
    const containerHeight = specialCoinContainer.offsetHeight;
    
    // Make sure the coin is fully visible
    const coinWidth = 100; // Width from CSS
    const coinHeight = 100; // Height from CSS
    
    const maxX = containerWidth - coinWidth;
    const maxY = containerHeight - coinHeight;
    
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    
    specialCoin.style.left = `${randomX}px`;
    specialCoin.style.top = `${randomY}px`;
    
    // Add click event
    specialCoin.addEventListener('click', handleSpecialCoinClick);
    
    // Add to container
    specialCoinContainer.appendChild(specialCoin);
    
    // Mark as active
    game.specialCoinActive = true;
    
    // Remove after 30 seconds
    setTimeout(() => {
        if (specialCoinContainer.contains(specialCoin)) {
            specialCoinContainer.removeChild(specialCoin);
            game.specialCoinActive = false;
        }
    }, 30 * 1000); // 30 seconds
}

function handleSpecialCoinClick(event) {
    // Remove the coin
    const specialCoin = event.target;
    specialCoinContainer.removeChild(specialCoin);
    game.specialCoinActive = false;
    
    // Determine reward (20% chance for boost, 80% chance for money)
    const randomChance = Math.random();
    
    if (randomChance < 0.2) { // 20% chance for boost
        // Apply 77% click boost for 1 minute
        game.specialCoinBoostActive = true;
        game.specialCoinBoostEndTime = Date.now() + (60 * 1000); // 1 minute from now
        
        // Create a notification
        showFloatingText('77% Click Boost for 1 minute!', event.clientX, event.clientY, '#ff9900');
        
        // Set a timeout to remove the boost after 1 minute
        setTimeout(() => {
            game.specialCoinBoostActive = false;
            console.log('Special coin boost expired');
        }, 60 * 1000); // 1 minute
    } else { // 80% chance for money
        // Generate random percentage between 10% and 60% of current money
        const minPercent = 10;
        const maxPercent = 60;
        const randomPercent = Math.floor(Math.random() * (maxPercent - minPercent + 1)) + minPercent;
        
        // Calculate amount based on percentage of current money
        const amount = (game.money * randomPercent) / 100;
        
        // Add money
        incrementMoney(amount);
        
        // Create a notification
        showFloatingText(`+${formatMoney(amount)} (${randomPercent}% of your money)`, event.clientX, event.clientY, '#2ecc71');
    }
}

function showFloatingText(text, x, y, color) {
    const floatingText = document.createElement('div');
    floatingText.textContent = text;
    floatingText.style.position = 'fixed';
    floatingText.style.left = `${x}px`;
    floatingText.style.top = `${y}px`;
    floatingText.style.color = color;
    floatingText.style.fontWeight = 'bold';
    floatingText.style.fontSize = '20px';
    floatingText.style.pointerEvents = 'none';
    floatingText.style.zIndex = '1000';
    floatingText.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.5)';
    floatingText.style.animation = 'floatUp 2s ease-out forwards';
    
    document.body.appendChild(floatingText);
    
    // Remove after animation completes
    setTimeout(() => {
        if (document.body.contains(floatingText)) {
            document.body.removeChild(floatingText);
        }
    }, 2000);
}

// Moon trip feature - No longer using the rocket prompt, using the moon button in header instead

function goToMoon() {
    // Change the background to moon
    document.body.style.backgroundImage = 'url("jrt0bgtf4vi61.jpg")';
    
    // Change the Bitcoin image to Moon Doge
    const bitcoinImg = document.getElementById('bitcoin-img');
    bitcoinImg.src = 'DogeMoon-removebg-preview.png';
    
    // Update game state
    game.moonMode = true;
    
    // Update upgrades to show moon-specific pickaxes
    updateUpgradesAvailability();
    
    // Show moon pickaxe (force display)
    document.querySelectorAll('.moon-only-upgrade').forEach(element => {
        element.style.display = 'block';
    });
    
    // Unlock achievement
    unlockAchievement('moonTrip', 'To The Moon!', 'You went to the moon with your Doge');
    
    // Hide the rocket container
    const container = document.getElementById('moon-trip-container');
    if (container) {
        container.style.display = 'none';
    }
    
    // Save the game
    saveGame();
}

function returnToEarth() {
    // Only return to Earth if we're in moon mode
    if (!game.moonMode) return;
    
    // Change the background back to normal
    document.body.style.backgroundImage = '';
    
    // Change the Bitcoin image back to normal Doge
    const bitcoinImg = document.getElementById('bitcoin-img');
    bitcoinImg.src = 'download.jpeg';
    
    // Update game state
    game.moonMode = false;
    
    // Hide moon pickaxes
    document.querySelectorAll('.moon-only-upgrade').forEach(element => {
        element.style.display = 'none';
    });
    
    // Update upgrades to hide moon-specific pickaxes
    updateUpgradesAvailability();
    
    // Save the game
    saveGame();
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initGame);
