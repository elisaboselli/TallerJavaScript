var deckModel = require("./deck.js");
var gameModel = require("./game.js");
var Deck = deckModel.deck;
var Game = gameModel.game;

function Round(game){
	var d = new Deck().mix();
	game.player1.cards = [d[0],d[2],d[4]];
	game.player2.cards = [d[1],d[3],d[5]];
	game.player1.points = getPoints(game.player1.cards);
	game.player2.points = getPoints(game.player2.cards);
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
			p = array[2].number +20;
		}
		if(b>10 && a<10){
			p = array[1].number +20;
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

module.exports.round = Round;
