class Ledge {
    constructor(game, x, y, width) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = 10;
        this.markedForRemoval = false;
    }
    
    update(deltaTime) {
        this.y += this.game.gameSpeed;
        
        // Random chance to disappear (1% per frame)
        if (Math.random() < 0.01) {
            this.markedForRemoval = true;
        }
    }
    
    draw(ctx) {
        ctx.fillStyle = '#8B4513'; // Brown color for ledges
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
