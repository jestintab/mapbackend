const router = require("express").Router();
let Driver = require("../models/driver.model");

//Get all drivers list as json

router.route("/").get((req, res) => {
  Driver.find()
    .then((drivers) => res.json(drivers))
    .catch((err) => res.status(400).json("Error: " + err));
});

//Get each driver data as json

router.route("/:id").get((req, res) => {
  Driver.findById(req.params.id)
    .then((drivers) => res.json(drivers))
    .catch((err) => res.status(400).json("Error: " + err));
});

//Login for drivers

router.route("/login").post((req, res) => {
  const driver_username = req.body.username;
  const password = req.body.password;
  Driver.findOne({ driver_username: driver_username })
    .then((user) => {
      if (!user) {
        return (res.json({ isAuth: 0, alertmsg: "No user found" }));
      } else {
        if (user.password === password) {
          user.online_status = 1;
          user.save()
                .then((onlineDriver) =>
                res.json({ isAuth: 1, driver: onlineDriver })
                )
           
        } else {
          return res.json({ isAuth: 0, alertmsg: "Invaild Password" });
        }
      }
    })
    .catch((err) => res.status(400).json("Error:" + err));
});

//Add a driver to db

router.route("/add").post((req, res) => {
  const driver_username = req.body.driver_username;
  const password = req.body.password;
  const online_status = 0;
  const status = 1;
  const location = {};
  const newDriver = new Driver({
    driver_username,
    password,
    status,
    online_status,
    location
  });

  newDriver
    .save()
    .then((data) => res.json({ alertmsg: "Driver Added!", drivers: data }))
    .catch((err) => res.status(400).json("Error: " + err));
});

//Add a new trip - push to trips array

router.route("/trip/:id").post((req, res) => {
  const location= req.body.location;

  Driver.findById(req.params.id).then((data) => {
    data.trips.push(req.body.trip);
    data.online_status =1;
    data.location= location;
    data.save()
      .then((driver) =>{
        res.json({
          msg: "New trip added",
          driver: driver,
        })
      })
      .catch((err) => res.status(400).json("Error:" + err));
  });
});

router.route("/endtrip/:id").post((req, res) => {
  
  const trip_id= req.body.trip_id;
  const location= req.body.location;
  const km = req.body.kilometers;
  const endtime = req.body.end_time;
  const drivepaths = req.body.drivepaths;

  Driver.findById(req.params.id).then((data) => {
    
    data.online_status =1;
    data.location= location;
    let trip = data.trips.id(trip_id);
    trip.end_time = endtime;
    trip.kilometers = km;
    trip.drivepaths = drivepaths;
    data.save()
      .then((driver) =>{
        res.json({
          msg: "Trip Ended",
          driver: driver,
        })
      })
      .catch((err) => res.status(400).json("Error:" + err));
  });
});

//Adding trip path coordinates - pushing to drivepaths array

router.route("/drivepath/:id").post((req, res) => {
  Driver.findById(req.params.id).then((data) => {
    data.trip_id = req.body.trip_id;
    data.drivepath = req.body.drivepath;
    let trip = data.trips.id(data.trip_id);
    trip.drivepaths.push(req.body.drivepath);
    data
      .save()
      .then((drivers) =>
        res.json({
          msg: "Trip path added",
          drivepaths: trip.drivepaths,
        })
      )
      .catch((err) => res.status(400).json("Error:" + err));
  });
});

module.exports = router;
