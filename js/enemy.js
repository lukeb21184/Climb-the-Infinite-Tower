class Enemy {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.speedX = Math.random() > 0.5 ? 2 : -2;
        this.animationFrame = 0;
    }
    
    update(deltaTime) {
        this.y += this.game.gameSpeed;
        
        // Horizontal movement
        this.x += this.speedX;
        
        // Change direction at edges
        if (this.x <= 0 || this.x + this.width >= this.game.gameWidth) {
            this.speedX *= -1;
        }
        
        // Animation
        this.animationFrame += deltaTime * 0.01;
    }
    
    draw(ctx) {
        // Body
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyes - animated
        const eyeOffset = Math.sin(this.animationFrame) * 2;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x + this.width/3, this.y + this.height/3 + eyeOffset, 4, 0, Math.PI * 2);
        ctx.arc(this.x + 2*this.width/3, this.y + this.height/3 + eyeOffset, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Angry eyebrows
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width/3 - 5, this.y + this.height/4);
        ctx.lineTo(this.x + this.width/3 + 5, this.y + this.height/4 - 3);
        ctx.moveTo(this.x + 2*this.width/3 - 5, this.y + this.height/4 - 3);
        ctx.lineTo(this.x + 2*this.width/3 + 5, this.y + this.height/4);
        ctx.stroke();
    }
}
