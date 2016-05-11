var deckModel = require("./deck.js");
var gameModel = require("./game.js");
var Deck = deckModel.deck;
var Game = gameModel.game;

function Round(game){
	var d = new Deck().mix();
	this.m = 0;
	this.env = 0;
	this.tru = 1;
	game.player1.cards = [d[0],d[2],d[4]];
	game.player2.cards = [d[1],d[3],d[5]];
	game.player1.pointsenv = getPoints(game.player1.cards);
	game.player2.pointsenv = getPoints(game.player2.cards);
	game.player1.mano = !(game.player1.mano);
	game.player2.mano = !(game.player2.mano);
}

function getPoints(array){
	var max = 0;
	var p = 0;
	if(array[0].suit === array[1].suit){
		p = points(array[0].number,array[1].number);
	}
	max = p;
	if(array[0].suit === array[2].suit){
		p = points(array[0].number,array[2].number);
	}
	if(p>max){
		max=p;
	}
	if(array[1].suit === array[2].suit){
		p = points(array[1].number,array[2].number);
	}
	if(p>max){
		max=p;
	}
	if(max===0){
		if(max<array[0] && array[0]<10){
			max = array[0];
		}
		if(max<array[1] && array[1]<10){
			max = array[1];
		}
		if(max<array[2] && array[2]<10){
			max = array[2];
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

function confrontPoints(){
	if(game.player1.pointsenv>game.player2.pointsenv){
		return game.player1;
	}
	if(game.player1.pointsenv<game.player2.pointsenv){
		return game.player2;
	}
	if(game.player1.pointsenv===game.player2.pointsenv){
		if(game.player1.mano){
			return game.player1;
		}
		return game.player2;
	}
}

function poderCantarEnvido(){
	if((this.m===0)&&(this.tru===1)){
		return true;
	}
	return false;
}

function jugarEnvido(){
	if(game.player1.cantoEnvido()){
		this.env = this.env + 1;
		if(game.player2.aceptoEnvido()){
			this.env = this.env + 1;
			confrontPoints().pointsTot = confrontPoints().pointsTot+this.env;
		}
		game.player1.pointsenv=this.env;
		this.env = 0;
	}
	if(game.player2.cantoEnvido()){
		this.env = this.env + 1;
		if(game.player1.aceptoEnvido()){
			this.env = this.env + 1;
			confrontPoints().pointsTot = confrontPoints().pointsTot+this.env;
		}
		game.player2.pointsenv=this.env;
		this.env = 0;
	}
}

function cantoEnvido(){
	return (confirm("¿Quieres cantar Envido?"));
}

function aceptoEnvido(){
	return (confirm("¿Quieres aceptar Envido?"));
}

module.exports.round = Round;
