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

app.get('/houses', function(req, res){
	
	mongoClient.connect(mongourl, function(err, db){
		assert.equal(null, err);
		
		var housesCollection = db.collection('houses');
		
		housesCollection.find({}).toArray(function(err, houses){
			assert.equal(null, err);
			
			res.send(houses);

			db.close();
		});
	});
});

// app.get('/', function(req, res){
// 	res.render('fill_waiting_time.ejs', {message: null});
// });

// app.post('/', function(req, res){
// 	var hospitalID = parseInt(req.body.hospital_id);
// 	var waitingTime = parseInt(req.body.waiting_time) * 60 * 1000;

// 	mongoClient.connect(mongourl, function(err, db){
// 		assert.equal(null, err);
		
// 		var hospitalsCollection = db.collection('hospitals');
		
// 		hospitalsCollection.findOne({"_id": hospitalID}, function(err, result){
// 			assert.equal(null, err);

// 			if(result == null){
// 				res.render('fill_waiting_time.ejs', {message: "Don't know this hospital ID! Try creating it first."});

// 				db.close();
// 			}else{
// 				hospitalsCollection.updateOne({"_id": hospitalID}, {"$set": {"waiting_time": waitingTime}}, function(err, result){
// 					assert.equal(null, err);

// 					res.render('fill_waiting_time.ejs', {message: "Waiting time updated successfully."});

// 					db.close();
// 				});
// 			}
// 		});
// 	});
// });

app.get('/admin', function(req, res){
	res.render('add_houses.ejs', {message: null});
});

app.post('/admin', function(req, res){
	var houseId = req.body.house_id;
	var houseName = req.body.house_name;
	var houseAddress = req.body.house_address;
	var privateRoom = parseFloat(req.body.private_room);
	var twinSharing = parseFloat(req.body.twin_sharing);
    var tripleSharing = parseFloat(req.body.triple_sharing);
    var fourSharing = parseFloat(req.body.four_sharing);
    var freeWifi = req.body.free_wifi;
    var washingMashine = req.body.washing_mashine;
    var fireExtinguisher = req.body.fire_extinguisher;
    var roWater = req.body.ro_water;
    var cctv = req.body.cctv;
    var fridge = req.body.fridge;
    var forBoys = req.body.for_boys;
    var forGirls = req.body.for_girls;


	var amenity= '';
    var for_whom='';
    
    if(forBoys != null && forGirls != null){
        for_whom = "both";
    }else if(forBoys != null && forGirls == null){
        for_whom = "boys"
    }else if(forBoys == null && forGirls != null){
        for_whom = "girls"
    }

	function checkbox_test() {
		var counter = 0, // counter for checked checkboxes
			i = 0,       // loop variable
			amenities = '',    // final amenities string
			// get a collection of objects with the specified 'input' TAGNAME
			input_obj = document.getElementsByTagName('amenities');
		// loop through all collected objects
		for (i = 0; i < input_obj.length; i++) {
			// if input object is checkbox and checkbox is checked then ...
			if (input_obj[i].type === 'checkbox' && input_obj[i].checked === true) {
				// ... increase counter and concatenate checkbox value to the url string
				counter++;
				amenities = amenities + '&c=' + input_obj[i].value;
			}
		}
		amenity=amenities;
		// display url string or message if there is no checked checkboxes
		if (counter > 0) {
			// remove first "&" from the generated url string
			amenities = amenities.substr(1);
			// display final url string
			alert(amenities);
			// or you can send checkbox values
			// window.location.href = 'my_page.php?' + url; 
		}
		else {
			alert('nothing checked');
		}


		var count = 0, // counter for checked checkboxes
			j = 0,       // loop variable
			whom = '',    // final amenities string
			// get a collection of objects with the specified 'input' TAGNAME
			input_for_whom = document.getElementsByTagName('for_whom');
		// loop through all collected objects
		for (j = 0; j < input_for_whom.length; j++) {
			// if input object is checkbox and checkbox is checked then ...
			if (input_for_whom[j].type === 'checkbox' && input_for_whom[i].checked === true) {
				// ... increase counter and concatenate checkbox value to the url string
				count++;
				whom = whom + '&c=' + input_for_whom[i].value;
			}
		}
		for_whom=whom;

	}

	//checkbox_test();

	var distanceInfy = parseFloat(req.body.distance_infy);
	var timeInfy = parseFloat(req.body.time_infy);
	var aboutProperty = req.body.about_property;
    var rating = req.body.rating;
    var housePhoneNumber = parseInt(req.body.house_phone_number);


	mongoClient.connect(mongourl, function(err, db){
		assert.equal(null, err);
		
		var housesCollection = db.collection('houses');
		
		housesCollection.findOne({"_id": houseId}, function(err, result){
			assert.equal(null, err);

			if(result != null){
				res.render('add_houses.ejs', {message: "Sorry! This house ID already exists."});

				db.close();
			}else{
				housesCollection.insertOne(
					{
						"house_id": houseId,
						"house_name": houseName,
						"house_address": houseAddress,
						"house_phone_number": housePhoneNumber,
						"private_room": privateRoom,
                        "twin_sharing": twinSharing,
                        "triple_sharing" : tripleSharing,
                        "four_sharing" : fourSharing,
                        "amenities" : amenity,
                        "free_wifi" : freeWifi,
                        "washing_mashine" : washingMashine,
                        "fire_extinguisher" : fireExtinguisher,
                        "ro_water" : roWater,
                        "cctv" : cctv,
                        "fridge" :fridge,
                        "for_whom" : for_whom,
                        "distance_infy": distanceInfy,
                        "time_infy" : timeInfy,
                        "about_property" : aboutProperty,
                        "rating" : rating
					}, 
					function(err, result){
						assert.equal(null, err);

						res.render('add_houses.ejs', {message: "House has been added successfully."});

						db.close();
				});
			}
		});
	});
});


//to delete hospitals
// problem :  can't use admin id 
//nahi chal raha hai
app.delete("/admin", (req, res, next) => {

    housesCollection.findOneAndRemove({house_id:req.body.house_id})
    .exec()
    .then(result => {
      res.status(200).json({
        message: `Hospital with hospital_id : ${req.body.house_id} deleted`
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


var port = 4321;
app.listen(port);

console.log('server running at http://localhost:' + port);