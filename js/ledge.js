class Ledge {
    constructor(game, x, y, width) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = 10;
        this.markedForRemoval = false;
        this.fadeAlpha = 1;
        this.timeAlive = 0;
        this.maxLifetime = 10000; // 10 seconds lifetime (increased from disappearing randomly)
    }
    
    update(deltaTime) {
        this.y += this.game.gameSpeed;
        this.timeAlive += deltaTime;
        
        // Only start fading after max lifetime
        if (this.timeAlive > this.maxLifetime) {
            this.markedForRemoval = true;
        }
        
        // Fade out if marked for removal (slower fade)
        if (this.markedForRemoval) {
            this.fadeAlpha -= 0.01; // Slower fade (was 0.05)
            if (this.fadeAlpha <= 0) {
                this.fadeAlpha = 0;
            }
        }
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.fadeAlpha;
        
        // Draw ledge with wood-like appearance
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw wood planks
        ctx.fillStyle = '#A0522D';
        for (let i = 0; i < this.width; i += 15) {
            ctx.fillRect(this.x + i, this.y, 10, this.height);
        }
        
        // Draw a subtle highlight to make ledges more visible
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        ctx.restore();
    }
}
