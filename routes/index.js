var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var router = express.Router();

var Game = require("../models/game").game;
var Player = require("../models/player").player;

/* GET home page. */
router.get('/', function (req, res) {
  var game = new Game();
  res.render('index', { user : req.user });
});

router.get('/register', function(req, res) {
    res.render('register', { });
});

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

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/newgame',function(req,res){
    res.render('newgame');
});

router.post('/newgame', function(req,res){
    var p1 = new Player ({name : req.body.Player1});
    var p2 = new Player ({name : req.body.Player2});
    var g = new Game ({name : req.body.GameName, player1 : p1 , player2 : p2});
    g.save(function (err, game){
        if(err){
            console.log(err);
        }  
        //Game.findOne({name:game.name},function(err,result){ 
        //    console.log(result); 
        //});
         res.redirect('/play?gameid=' + game._id);
    });
});

router.get('/play', function(req,res){
    //res.status(200).send("playing !!");
    /*console.log(req);
    console.log("body");
    console.log(req.query.gameid);
    console.log("lala");*/
    Game.findOne({_id:req.query.gameid},function(err,game){
        console.log(game);
        res.render('play', {g : game});
    });

});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

//Esto no anda pero esta bien
router.get('/game1', function(req, res){
    var g = new Game({});
    res.status(200).send(g);
    /*Game.findOne({name:"game1"}, function(err,result){
        if (err) {
            console.log("err");
            console.log(err);
            done(err);
        }
        res.write(result);
    });*/
});

module.exports = router;
