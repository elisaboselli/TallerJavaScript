var mongoose = require("mongoose");

function Player(name){
	//name player
	this.name=name;
	//player cards
	this.handscards= [];
	//cards played
	this.playedcards = [];
	//envido points of player
	this.pointsenv=0;
};

//Calculamos los puntos del envido de un jugador
Player.prototype.getPoints = function(){
	var max = 0;
	var p = 0;
	if(this.handscards[0].suit === this.handscards[1].suit){
		p = points(this.handscards[0].number,this.handscards[1].number);
	}
	max = p;
	if(this.handscards[0].suit === this.handscards[2].suit){
		p = points(this.handscards[0].number,this.handscards[2].number);
	}
	if(p>max){
		max=p;
	}
	if(this.handscards[1].suit === this.handscards[2].suit){
		p = points(this.handscards[1].number,this.handscards[2].number);
	}
	if(p>max){
		max=p;
	}
	if(max===0){
		if(max<this.handscards[0].number && this.handscards[0].number<10){
			max = this.handscards[0].number;
		}
		if(max<this.handscards[1].number && this.handscards[1].number<10){
			max = this.handscards[1].number;
		}
		if(max<this.handscards[2].number && this.handscards[2].number<10){
			max = this.handscards[2].number;
		}
	}
	return max;
}

//Funcion auxiliar: Si las cartas son del mismo palo, calcula cuantos son los puntos.
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
