var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('YOUR MONGO DB HERE/DB', ['COLLECTION']);


// all Player
router.get('/players', function(req, res, next){
	db.players.find(function(err, players){
		if(err){
			res.send(err);
		}
		res.json(players);
	});
});

//single Player
router.get('/player/:id', function(req, res, next){
	db.players.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, player){
		if(err){
			res.send(err);
		}
		res.json(cam);
	});
});

//Save Player
router.post('/player', function(req, res, next){
	var player = req.body;
	if(player.playerName == '' && player.streaming == '' && player.votting == '' && player.position == '' && player.ptz == ''){
		res.status(400);
		res.json({"error" : "Bad data"});
	}
	else{
		db.players.save(player, function(err, player){
			if(err){
				res.send(err);
			}
			res.json(player);			
		});
	}

});

//Delete Player
router.delete('/player/:id', function(req, res, next){
	db.players.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, player){
		if(err){
			res.send(err);
		}
		res.json(player);
	});
});


//Update Player
router.put('/player/:id', function(req, res, next){
	var player = req.body;
	var updPlayer = {};

	if(player.playerName){
		updPlayer.playerName = player.playerName;
	}

	if(player.streaming){
		updPlayer.streaming = player.streaming;
	}
	
	if(player.votting){
		updPlayer.votting = player.votting;

	}	

	if(player.position){
		updPlayer.position = player.position;
	}

	if(player.ptz){
		updPlayer.ptz = player.ptz;
	}

	if(!updPlayer){
		res.status(400);
		res.json({
			"error" : "Bad Data"
		});
	}
	else{
		db.players.update({_id: mongojs.ObjectId(req.params.id)},updCam, {}, function(err, player){
			if(err){
				res.send(err);
			}
			res.json(player);
		});		
	}

});


module.exports = router

