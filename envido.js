function jugarEnvido(){

	if(game.player1.cantoEnvido()){
		//ENVIDO + QUIERO
		
		if(game.player2.aceptoEnvido()){
			confrontPoints().pointsTot = confrontPoints().pointsTot+ 2;
		}else{
			if (game.player2.cantoEnvido2()){
				if(game.player1.aceptoEnvido2()){
					confrontPoints().pointsTot = confrontPoints().pointsTot+ 4;
				}
				
			}
			else{
			//ENVIDO + NO QUIERO
				game.player1.pointsTot=1;
			}
		}//ENVIDO + ENVIDO
		if (game.player2.cantoEnvido2()){
			//ENVIDO + ENVIDO + QUIERO
			if(game.player1.aceptoEnvido2()){
				confrontPoints().pointsTot = confrontPoints().pointsTot+ 4;
			}else{
			//ENVIDO + ENVIDO + NO QUIERO
			game.player2.pointsTot= game.player2.pointsTot+1;
			}//ENVIDO + ENVIDO + REALENVIDO
			if(game.player1.cantoRealEnvido()){
				//ENVIDO + ENVIDO + REALENVIDO + QUIERO
				if(game.player2.aceptoRealEnvido()){
					confrontPoints().pointsTot = confrontPoints().pointsTot+ 7;
				}else{
				//ENVIDO + ENVIDO + REALENVIDO + NO QUIERO					
				}game.player1.pointsTot = game.player1.pointsTot+ 4;
				//ENVIDO + ENVIDO + REALENVIDO + FALTAENVIDO
				if (game.player2.cantoFaltaEnvido()){
					//ENVIDO + ENVIDO + REALENVIDO + FALTAENVIDO + QUIERO
					if(game.player1.aceptoFaltaEnvido()){
						confrontPoints().pointsTot = confrontPoints().pointsTot+ ---------;						
					}else{//ENVIDO + ENVIDO + REALENVIDO + FALTAENVIDO + NO QUIERO
					game.player1.pointsTot = game.player1.pointsTot+ 7;
					}			
				}
			}
			//ENVIDO + ENVIDO + FALTAENVIDO
			if(game.player2.cantoFaltaEnvido){
				//ENVIDO + ENVIDO + FALTAENVIDO + QUIERO
				if(game.player1.aceptoFaltaEnvido){
					confrontPoints().pointsTot = confrontPoints().pointsTot+ ---------;													
				}else{					
				//ENVIDO + ENVIDO + FALTAENVIDO + NO QUIERO  
				game.player2.pointsTot = game.player1.pointsTot+ 4;
				}
			}
		}
		//ENVIDO + REALENVIDO
		if (game.player2.cantoRealEnvido()){
			//ENVIDO + REALENVIDO + QUIERO
			if(game.player1.aceptoRealEnvido){
				confrontPoints().pointsTot = confrontPoints().pointsTot+5;																			
			}else{//ENVIDO + REALENVIDO + NO QUIERO
				game.player2.pointsTot = game.player2.pointsTot+ 2; 
			}
		}
		//ENVIDO + FALTAENVIDO		
		if (game.player2.cantoFaltaEnvido()){
			//ENVIDO + FALTAENVIDO + QUIERO
			if (game.player1.aceptoFaltaEnvido()){
				confrontPoints().pointsTot = confrontPoints().pointsTot+-------;																								
			}else{//ENVIDO + FALTAENVIDO + NO QUIERO	
				game.player2.pointsTot = game.player2.pointsTot+ 2; 
			}		
		}			
	}
}


