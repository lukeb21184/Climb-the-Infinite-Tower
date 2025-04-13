// Main game class
class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 400;
        this.canvas.height = 600;
        
        this.gameWidth = this.canvas.width;
        this.gameHeight = this.canvas.height;
        
        this.player = new Player(this);
        this.ledges = [];
        this.enemies = [];
        this.pickups = [];
        
        this.score = 0;
        this.highestLedge = 0;
        this.lives = 3;
        this.customizationPoints = 0;
        
        this.gameSpeed = 2;
        this.spawnRate = 100;
        this.lastSpawn = 0;
        
        this.isRunning = false;
        this.animationId = null;
        
        this.setupEventListeners();
        this.loadCustomizationOptions();
    }
    
    setupEventListeners() {
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());
        
        // Keyboard controls
        window.addEventListener('keydown', (e) => {
            if (!this.isRunning) return;
            
            if (e.key === 'ArrowLeft') {
                this.player.moveLeft();
            } else if (e.key === 'ArrowRight') {
                this.player.moveRight();
            } else if (e.key === 'ArrowUp' || e.key === ' ') {
                this.player.jump();
            }
        });
    }
    
    startGame() {
        this.score = 0;
        this.highestLedge = 0;
        this.lives = 3;
        this.gameSpeed = 2;
        
        this.player.reset();
        this.ledges = [];
        this.enemies = [];
        this.pickups = [];
        
        // Create initial ledge
        this.addLedge(this.gameWidth / 2 - 50, this.gameHeight - 20, 100);
        
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-over-screen').classList.add('hidden');
        
        this.isRunning = true;
        this.lastTime = 0;
        this.animationId = requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
    
    restartGame() {
        this.startGame();
    }
    
    gameLoop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        this.update(deltaTime);
        this.draw();
        
        if (this.isRunning) {
            this.animationId = requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
        }
    }
    
    update(deltaTime) {
        // Update player
        this.player.update(deltaTime);
        
        // Update ledges
        for (let i = this.ledges.length - 1; i >= 0; i--) {
            this.ledges[i].update(deltaTime);
            
            // Remove ledges that are off screen
            if (this.ledges[i].y > this.gameHeight) {
                this.ledges.splice(i, 1);
            }
        }
        
        // Update enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            this.enemies[i].update(deltaTime);
            
            // Check collision with player
            if (this.checkCollision(this.player, this.enemies[i])) {
                this.lives--;
                this.enemies.splice(i, 1);
                
                if (this.lives <= 0) {
                    this.gameOver();
                }
            }
            
            // Remove enemies that are off screen
            if (this.enemies[i].y > this.gameHeight) {
                this.enemies.splice(i, 1);
            }
        }
        
        // Update pickups
        for (let i = this.pickups.length - 1; i >= 0; i--) {
            this.pickups[i].update(deltaTime);
            
            // Check collision with player
            if (this.checkCollision(this.player, this.pickups[i])) {
                this.applyPickup(this.pickups[i].type);
                this.pickups.splice(i, 1);
            }
            
            // Remove pickups that are off screen
            if (this.pickups[i].y > this.gameHeight) {
                this.pickups.splice(i, 1);
            }
        }
        
        // Spawn new ledges, enemies, and pickups
        if (this.lastSpawn > this.spawnRate) {
            this.spawnObjects();
            this.lastSpawn = 0;
        } else {
            this.lastSpawn += deltaTime;
        }
        
        // Update score based on highest ledge
        if (this.player.y < this.highestLedge) {
            this.highestLedge = this.player.y;
            this.score = Math.floor(-this.highestLedge / 10);
            document.getElementById('score').textContent = `Height: ${this.score}`;
        }
        
        // Increase difficulty as score increases
        this.gameSpeed = 2 + Math.floor(this.score / 1000) * 0.5;
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
        
        // Draw background
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
        
        // Draw ledges
        this.ledges.forEach(ledge => ledge.draw(this.ctx));
        
        // Draw enemies
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        
        // Draw pickups
        this.pickups.forEach(pickup => pickup.draw(this.ctx));
        
        // Draw player
        this.player.draw(this.ctx);
    }
    
    spawnObjects() {
        // Spawn new ledge
        const ledgeX = Math.random() * (this.gameWidth - 100);
        const ledgeY = -20;
        const ledgeWidth = 50 + Math.random() * 50;
        this.addLedge(ledgeX, ledgeY, ledgeWidth);
        
        // Spawn enemy (10% chance)
        if (Math.random() < 0.1) {
            const enemyX = Math.random() * (this.gameWidth - 30);
            const enemyY = -30;
            this.addEnemy(enemyX, enemyY);
        }
        
        // Spawn pickup (5% chance)
        if (Math.random() < 0.05) {
            const pickupX = Math.random() * (this.gameWidth - 20);
            const pickupY = -20;
            const pickupTypes = ['life', 'speed', 'points'];
            const pickupType = pickupTypes[Math.floor(Math.random() * pickupTypes.length)];
            this.addPickup(pickupX, pickupY, pickupType);
        }
    }
    
    addLedge(x, y, width) {
        this.ledges.push(new Ledge(this, x, y, width));
    }
    
    addEnemy(x, y) {
        this.enemies.push(new Enemy(this, x, y));
    }
    
    addPickup(x, y, type) {
        this.pickups.push(new Pickup(this, x, y, type));
    }
    
    checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
    
    applyPickup(type) {
        switch (type) {
            case 'life':
                this.lives++;
                document.getElementById('lives').textContent = `Lives: ${this.lives}`;
                break;
            case 'speed':
                this.player.jumpPower += 1;
                setTimeout(() => {
                    this.player.jumpPower -= 1;
                }, 10000);
                break;
            case 'points':
                this.customizationPoints += 50;
                document.getElementById('customization-points').textContent = `Points: ${this.customizationPoints}`;
                break;
        }
    }
    
    gameOver() {
        this.isRunning = false;
        cancelAnimationFrame(this.animationId);
        
        // Award customization points based on score
        const earnedPoints = Math.floor(this.score / 10);
        this.customizationPoints += earnedPoints;
        
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('earned-points').textContent = earnedPoints;
        document.getElementById('customization-points').textContent = `Points: ${this.customizationPoints}`;
        
        document.getElementById('game-over-screen').classList.remove('hidden');
        
        // Update customization options display
        this.loadCustomizationOptions();
    }
    
    loadCustomizationOptions() {
        const optionsContainer = document.querySelector('.customization-options');
        optionsContainer.innerHTML = '';
        
        const options = [
            { id: 'hat1', name: 'Cool Hat', cost: 100, sprite: 'hat1' },
            { id: 'hat2', name: 'Wizard Hat', cost: 200, sprite: 'hat2' },
            { id: 'color1', name: 'Red Outfit', cost: 150, sprite: 'color1' },
            { id: 'color2', name: 'Blue Outfit', cost: 150, sprite: 'color2' },
            { id: 'speed', name: 'Permanent Speed+', cost: 500, sprite: 'speed' }
        ];
        
        options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = `customization-option ${this.player.customizations.includes(option.id) ? 'selected' : ''}`;
            optionElement.dataset.id = option.id;
            
            optionElement.innerHTML = `
                <img src="assets/sprites/${option.sprite}.png" alt="${option.name}">
                <p>${option.name}</p>
                <p>Cost: ${option.cost}</p>
            `;
            
            if (!this.player.customizations.includes(option.id) && this.customizationPoints >= option.cost) {
                optionElement.addEventListener('click', () => {
                    this.purchaseCustomization(option.id, option.cost);
                });
            }
            
            optionsContainer.appendChild(optionElement);
        });
    }
    
    purchaseCustomization(id, cost) {
        if (this.customizationPoints >= cost && !this.player.customizations.includes(id)) {
            this.customizationPoints -= cost;
            this.player.customizations.push(id);
            
            // Apply the customization
            if (id === 'speed') {
                this.player.jumpPower += 0.5;
            }
            
            document.getElementById('customization-points').textContent = `Points: ${this.customizationPoints}`;
            this.loadCustomizationOptions();
        }
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    const game = new Game();
});
