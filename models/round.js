//var deckModel = require("../models/deck.js");

//var Deck = deckModel.Deck;


function Round(c1,c2,c3,c4,c5,c6){
	this.cardsplayer1 = [c1,c3,c5];
	this.cardsplayer2 = [c2,c4,c6];
}

/*function Round(){
	var d = ((new Deck.deck()).sorted).mix;
	this.cardsplayer1 = [d[0],d[2],d[4]];
	this.cardsplayer2 = [d[1],d[3],d[5]];
}*/

module.exports.round = Round;
