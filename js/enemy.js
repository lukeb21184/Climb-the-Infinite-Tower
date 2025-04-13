class Enemy {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.speedX = Math.random() > 0.5 ? 1 : -1;
    }
    
    update(deltaTime) {
        this.y += this.game.gameSpeed;
        
        // Horizontal movement
        this.x += this.speedX;
        
        // Change direction at edges
        if (this.x <= 0 || this.x + this.width >= this.game.gameWidth) {
            this.speedX *= -1;
        }
    }
    
    draw(ctx) {
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw eyes
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x + 5, this.y + 5, 5, 5);
        ctx.fillRect(this.x + 20, this.y + 5, 5, 5);
    }
}
