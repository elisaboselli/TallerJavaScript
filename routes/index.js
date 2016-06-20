var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var router = express.Router();
var Game = require("../models/game").game;
var Player = require("../models/player").player;
var Round = require("../models/round").round;
var Card = require("../models/card").card;
var StateMachine = require("../node_modules/javascript-state-machine/state-machine.js");


/* GET home page. */
router.get('/', function (req, res) {
  var game = new Game();
  res.render('index', { user : req.user });
});

/* GET registe page.*/
router.get('/register', function(req, res) {
    res.render('register', { });
});

/* Post register page.*/
router.post('/register', function(req, res) {
    User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
        if (err) {
            return res.render('register', { user : user });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

/* GET login page.*/
router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

/* POST login page*/
router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});
/* GET logout page*/
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
/* GET newgame page*/
router.get('/newgame',function(req,res){
    res.render('newgame');
});
/*POST newgame page*/
router.post('/newgame', function(req,res){
    var g = new Game ({name : req.body.GameName, player1 : req.body.Player1 , player2 : req.body.Player2 , score: [0,0], currentHand: req.body.Player2, fin:req.body.cantidad});
    g.save(function (err, game){;
        if(err){
            console.log(err);
        }
        res.redirect('/play?gameid=' + game._id);
    });
});
/*GET play page*/
router.get('/play', function(req,res){
    Game.findOne({_id:req.query.gameid},function(err,game){
        if (game.currentRound == undefined){
            game.newRound();
            game.save(function(err,game2){
                if (err){
                    console.log(err);
                }
                res.render('play', {g : game2});
            });
        }
        var r = game.currentRound;
        r.__proto__ = Round.prototype;
        r.actState(r.fsm.current);
        var turn=(game.currentRound.isTurn());
        if (turn.handscards[0]!==null)
            var c1 = './images/cards/'+(turn.handscards[0].number)+(turn.handscards[0].suit)+'.jpg';
        if (turn.handscards[1]!==null)
            var c2 = './images/cards/'+(turn.handscards[1].number)+(turn.handscards[1].suit)+'.jpg';
        if (turn.handscards[2]!==null)
            var c3 = './images/cards/'+(turn.handscards[2].number)+(turn.handscards[2].suit)+'.jpg';
        res.render('play', {g : game, c1 : c1, c2 : c2, c3 : c3});
    });
});


/*POST play  page*/
router.post('/play', function(req,res){
    Game.findOne({_id:req.body.gameid}, function(err,game){
        var r = game.currentRound;
        r.__proto__ = Round.prototype;
        r.actState(r.fsm.current);
        //game.currentRound=r;
        if (req.body.jugada !== 'play card1' && req.body.jugada !== 'play card2' && req.body.jugada !== 'play card3'){
            game.play(req.body.jugada);
        }
        if (req.body.jugada == 'play card1'){
            game.play('play card',0);   
        }
        if (req.body.jugada == 'play card2'){
            game.play('play card',1);   
        }
        if (req.body.jugada == 'play card3'){
            game.play('play card',2);   
        }
        if(r.fsm.current=='fin') {
            game.score[0] += r.score[0];
            game.score[1] += r.score[1];
            Game.update({ _id: game._id }, { $set :{score : game.score ,currentRound:r}},function (err,result){    
                if (game.win()){
                    res.redirect('/resultadogame?gameid=' + game._id);
                }
                else{
                    res.redirect('/resultadoround?gameid=' + game._id);
                }
            });
        }
        else{
            Game.update({ _id: game._id }, { $set :{currentRound : r }},function (err,result){
                if(err){
                    console.log(err);
                }
                res.redirect('/play?gameid=' + game._id);
            });
        }
    });
});

/*GET resaltadogame page*/
router.get('/resultadogame', function(req,res){
    Game.findOne({_id:req.query.gameid},function(err,game){
        if (err){
            console.log(err);
        }
        res.render('resultadogame',{g:game});
    });
});

/*POST resultadogame page*/
router.post('/resultadogame', function(req,res){
        res.redirect('/');
    });

/*GET resultadoround page*/
router.get('/resultadoround', function(req,res){
    Game.findOne({_id:req.query.gameid},function(err,game){
        if (err){
            console.log(err);
        }
        res.render('resultadoround',{g:game});
    });
});

/*POST resultadoround page*/
router.post('/resultadoround', function(req,res){
    Game.findOne({_id:req.body.gameid}, function(err,game){
        game.newRound();
        Game.update({ _id: game._id }, { $set :{currentRound : game.currentRound , currentHand : game.currentHand }},function (err,result){
            if(err){    
                console.log(err);
            }
            res.redirect('/play?gameid=' + game._id);
        });
    });
});


module.exports = router;
