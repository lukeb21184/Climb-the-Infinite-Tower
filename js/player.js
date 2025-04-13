class Player {
    constructor(game) {
        this.game = game;
        this.width = 30;
        this.height = 50;
        this.x = this.game.gameWidth / 2 - this.width / 2;
        this.y = this.game.gameHeight - this.height - 20;
        this.speedX = 0;
        this.speedY = 0;
        this.maxSpeed = 5;
        this.jumpPower = 10;
        this.gravity = 0.5;
        this.onGround = false;
        this.customizations = [];
    }
    
    reset() {
        this.x = this.game.gameWidth / 2 - this.width / 2;
        this.y = this.game.gameHeight - this.height - 20;
        this.speedX = 0;
        this.speedY = 0;
        this.onGround = false;
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
        ctx.fillStyle = this.customizations.includes('color1') ? '#ff5555' : 
                        this.customizations.includes('color2') ? '#5555ff' : '#55ff55';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw hat if customization is equipped
        if (this.customizations.includes('hat1') || this.customizations.includes('hat2')) {
            ctx.fillStyle = this.customizations.includes('hat1') ? '#ffaa00' : '#aa00ff';
            ctx.fillRect(this.x - 5, this.y - 10, this.width + 10, 10);
        }
        
        // Draw eyes
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x + 5, this.y + 10, 5, 5);
        ctx.fillRect(this.x + 20, this.y + 10, 5, 5);
    }
}
