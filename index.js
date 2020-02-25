var mongoClient = require('mongodb').MongoClient;
var mongourl = 'mongodb://localhost:27017/istay_db';
var assert = require('assert');

var app = require('express')();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());	
app.set('views', '.');
app.set('view engine', 'ejs');

app.get('/hospitals', function(req, res){
	
	mongoClient.connect(mongourl, function(err, db){
		assert.equal(null, err);
		
		var hospitalsCollection = db.collection('hospitals');
		
		hospitalsCollection.find({}).toArray(function(err, hospitals){
			assert.equal(null, err);
			
			res.send(hospitals);

			db.close();
		});
	});
});

app.get('/', function(req, res){
	res.render('fill_waiting_time.ejs', {message: null});
});

app.post('/', function(req, res){
	var hospitalID = parseInt(req.body.hospital_id);
	var waitingTime = parseInt(req.body.waiting_time) * 60 * 1000;

	mongoClient.connect(mongourl, function(err, db){
		assert.equal(null, err);
		
		var hospitalsCollection = db.collection('hospitals');
		
		hospitalsCollection.findOne({"_id": hospitalID}, function(err, result){
			assert.equal(null, err);

			if(result == null){
				res.render('fill_waiting_time.ejs', {message: "Don't know this hospital ID! Try creating it first."});

				db.close();
			}else{
				hospitalsCollection.updateOne({"_id": hospitalID}, {"$set": {"waiting_time": waitingTime}}, function(err, result){
					assert.equal(null, err);

					res.render('fill_waiting_time.ejs', {message: "Waiting time updated successfully."});

					db.close();
				});
			}
		});
	});
});

app.get('/admin', function(req, res){
	res.render('add_hospital.ejs', {message: null});
});

app.post('/admin', function(req, res){
	var hospitalID = parseInt(req.body.hospital_id);
	var waitingTime = parseInt(req.body.waiting_time) * 60 * 1000;
	var latitude = parseFloat(req.body.latitude);
	var longitude = parseFloat(req.body.longitude);
	var hospitalName = req.body.hospital_name;
	var state = req.body.state;
	var city = req.body.city;
	var number = parseInt(req.body.number);

	mongoClient.connect(mongourl, function(err, db){
		assert.equal(null, err);
		
		var hospitalsCollection = db.collection('hospitals');
		
		hospitalsCollection.findOne({"_id": hospitalID}, function(err, result){
			assert.equal(null, err);

			if(result != null){
				res.render('add_hospital.ejs', {message: "Sorry! This hospital ID already exists."});

				db.close();
			}else{
				hospitalsCollection.insertOne(
					{
						"_id": hospitalID,
						"waiting_time": waitingTime,
						"latitude": latitude,
						"longitude": longitude,
						"name": hospitalName,
						"state": state,
						"city": city,
						"number": number
					}, 
					function(err, result){
						assert.equal(null, err);

						res.render('add_hospital.ejs', {message: "Hospital has been added successfully."});

						db.close();
				});
			}
		});
	});
});

var port = 4321;
app.listen(port);

console.log('server running at http://localhost:' + port);