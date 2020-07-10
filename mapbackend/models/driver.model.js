const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const driverSchema = new Schema(
  {
    driver_username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    status: { type: Boolean, required: true },
    online_status: { type: Number },
    location: { lat: Number, lng: Number },
    trips: [
      {
        start_time: Date,
        end_time: Date,
        last_updated: Date,
        kilometers: Number,
        drivepaths: [{ lat: Number, lng: Number }],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Driver = mongoose.model("Drivers", driverSchema);

module.exports = Driver;
