class Player {
    constructor(game) {
        this.game = game;
        this.width = 20;  // Reduced from 30 (33% smaller)
        this.height = 30; // Reduced from 50 (40% smaller)
        this.reset();
        
        this.speedX = 0;
        this.maxSpeed = 5;
        this.jumpPower = 15; // Increased from 10 (50% higher jump)
        this.gravity = 0.5;
        this.onGround = false;
        this.canDoubleJump = false;
        this.hasDoubleJumped = false;
        this.customizations = [];
    }
    
    reset() {
        this.x = this.game.gameWidth / 2 - this.width / 2;
        this.y = this.game.gameHeight - this.height - 20;
        this.speedY = 0;
        this.onGround = false;
        this.hasDoubleJumped = false;
    }
    
    moveLeft() {
        this.speedX = -this.maxSpeed;
    }
    
    moveRight() {
        this.speedX = this.maxSpeed;
    }
    
    jump() {
        if (this.onGround) {
            this.speedY = -this.jumpPower;
            this.onGround = false;
            this.hasDoubleJumped = false;
        } else if (this.canDoubleJump && !this.hasDoubleJumped) {
            this.speedY = -this.jumpPower * 0.8;
            this.hasDoubleJumped = true;
        }
    }
    
    update(deltaTime) {
        // Apply horizontal movement
        this.x += this.speedX;
        
        // Apply gravity
        this.speedY += this.gravity;
        this.y += this.speedY;
        
        // Check for collisions with ledges
        this.onGround = false;
        for (const ledge of this.game.ledges) {
            if (this.y + this.height >= ledge.y && 
                this.y + this.height <= ledge.y + 10 &&
                this.x + this.width > ledge.x && 
                this.x < ledge.x + ledge.width) {
                
                this.y = ledge.y - this.height;
                this.speedY = 0;
                this.onGround = true;
                this.hasDoubleJumped = false;
            }
        }
        
        // Screen boundaries
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > this.game.gameWidth) {
            this.x = this.game.gameWidth - this.width;
        }
        
        // Game over if player falls off bottom
        if (this.y > this.game.gameHeight) {
            this.game.lives--;
            
            if (this.game.lives <= 0) {
                this.game.gameOver();
            } else {
                // Reset player position
                this.y = -this.height;
                this.x = this.game.gameWidth / 2 - this.width / 2;
                this.speedY = 0;
            }
        }
        
        // Camera follows player (scroll up)
        if (this.y < this.game.gameHeight / 3) {
            const diff = this.game.gameHeight / 3 - this.y;
            this.y += diff;
            
            // Move all game objects down
            this.game.ledges.forEach(ledge => ledge.y += diff);
            this.game.enemies.forEach(enemy => enemy.y += diff);
            this.game.pickups.forEach(pickup => pickup.y += diff);
        }
    }
    
    draw(ctx) {
        // Body
        ctx.fillStyle = this.customizations.includes('color1') ? '#FF6B6B' : 
                        this.customizations.includes('color2') ? '#4ECDC4' : '#2ecc71';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Head
        ctx.fillStyle = this.customizations.includes('color1') ? '#e74c3c' : 
                       this.customizations.includes('color2') ? '#3498db' : '#27ae60';
        ctx.fillRect(this.x, this.y - 5, this.width, 10);
        
        // Eyes
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x + 3, this.y, 4, 4);  // Smaller eyes
        ctx.fillRect(this.x + 13, this.y, 4, 4);  // Smaller eyes
        
        // Draw hat if customization is equipped
        if (this.customizations.includes('hat1') || this.customizations.includes('hat2')) {
            ctx.fillStyle = this.customizations.includes('hat1') ? '#e67e22' : '#9b59b6';
            ctx.fillRect(this.x - 3, this.y - 10, this.width + 6, 8); // Smaller hat
        }
    }
}
