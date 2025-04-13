class Pickup {
    constructor(game, x, y, type) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.type = type;
    }
    
    update(deltaTime) {
        this.y += this.game.gameSpeed;
    }
    
    draw(ctx) {
        switch (this.type) {
            case 'life':
                ctx.fillStyle = '#ff69b4'; // Pink
                break;
            case 'speed':
                ctx.fillStyle = '#ffff00'; // Yellow
                break;
            case 'points':
                ctx.fillStyle = '#00ffff'; // Cyan
                break;
        }
        
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw symbol based on type
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        let symbol = '';
        switch (this.type) {
            case 'life': symbol = '♥'; break;
            case 'speed': symbol = '⚡'; break;
            case 'points': symbol = '★'; break;
        }
        
        ctx.fillText(symbol, this.x + this.width / 2, this.y + this.height / 2);
    }
}
