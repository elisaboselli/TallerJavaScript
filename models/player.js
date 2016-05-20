function Player(game, name){
	this.name=name;
	this.game = game;
	this.cards= [];
	this.pointsenv=0;
	//saque esto porque se modelaria con turn.
	//this.mano= false;
	this.pointsTot = 0;
}

Player.prototype.jugarCarta = function(x){
	if(this.cards[x]!= null){
		var aux = this.cards[x];
		this.cards[x] = null;
		return aux;
	}
	//throw "No se puede jugar esa carta";
};

Player.prototype.getPoints = function(){
	var max = 0;
	var p = 0;
	console.log(this.cards);
	if(this.cards[0].suit === this.cards[1].suit){
		p = points(this.cards[0].number,this.cards[1].number);
	}
	max = p;
	if(this.cards[0].suit === this.cards[2].suit){
		p = points(this.cards[0].number,this.cards[2].number);
	}
	if(p>max){
		max=p;
	}
	if(this.cards[1].suit === this.cards[2].suit){
		p = points(this.cards[1].number,this.cards[2].number);
	}
	if(p>max){
		max=p;
	}
	if(max===0){
		if(max<this.cards[0] && this.cards[0]<10){
			max = this.cards[0];
		}
		if(max<this.cards[1] && this.cards[1]<10){
			max = this.cards[1];
		}
		if(max<this.cards[2] && this.cards[2]<10){
			max = this.cards[2];
		}
	}
	return max;
}

function points(a,b){
	var p = 0;
	if (a>10 || b>10 ){
		if(a>10 && b<10){
			p = b +20;
		}
		if(b>10 && a<10){
			p = a+20;
		}
		if(a>10 && b>10){
			p = 20;
		}
	}
	else{
		p = a + b +20;
	}
	return p;
}

module.exports.player = Player;
