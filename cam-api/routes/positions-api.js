var express = require('express');
var router = express.Router();
var seneca = require('seneca')()
var mongojs = require('mongojs');
var db = mongojs('YOUR MONGO DB HERE/DB', ['COLLECTION']);


// all cam
router.get('/positions', function(req, res, next){
	db.positions.find(function(err, positions){
		if(err){
			res.send(err);
		}
		res.json(positions);
	});
});

//single cams
router.get('/positon/:id', function(req, res, next){
	db.positions.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, position){
		if(err){
			res.send(err);
		}
		res.json(position);
	});
});

//Save cam
router.post('/position', function(req, res, next){
	var position = req.body;
	if(position.camid == '' && position.playerid == '' && position.pan !== 0 && position.tilt !== 0 && position.zoom !== 0){
		res.status(400);
		res.json({"error" : "Bad data"});
	}
	else{
		db.positions.save(position, function(err, position){
			if(err){
				res.send(err);
			}
			res.json(position);			
		});
	}

});

//Delete cam
router.delete('/position/:id', function(req, res, next){
	db.positions.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, position){
		if(err){
			res.send(err);
		}
		res.json(position);
	});
});


//Update
router.put('/position/:id', function(req, res, next){
	var position = req.body;
	var updPosition = {};

	if(position.camid){
		updPosition.camid = position.camid;
	}

	if(position.playerid){
		updPosition.playerid = position.playerid;
	}
	
	if(position.pan){
		updPosition.pan = position.pan;


	}	
	if(position.tilt){
		updPosition.tilt = position.tilt;


	}		
	if(position.zoom){
		updPosition.zoom = position.zoom;


	}		

	if(!updPosition){
		res.status(400);
		res.json({
			"error" : "Bad Data"
		});
	}
	else{
		db.positions.update({_id: mongojs.ObjectId(req.params.id)},updPosition, {}, function(err, position){
			if(err){
				res.send(err);
			}
			res.json(position);
		});		
	}

});



module.exports = router

