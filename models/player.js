function Player(name){
	this.name=name;
	this.cards= [];
	this.pointsenv=0;
	this.mano= false;
	this.pointsTot = 0;
}

Player.prototype.jugarCarta = function(x){
	if(this.cards[x]!= null){
		var aux = this.cards[x];
		this.cards[x] = null;
		return aux;
	}
	// tirar una excepcion por argumento invalido.
};

module.exports.player = Player;
