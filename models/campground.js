const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageScema = new Schema({
  url: String,
  filename: String,
});

ImageScema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const CampgroundSchema = new Schema({
  title: String,
  images: [ImageScema],
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

CampgroundSchema.post("findOneAndDelete", async function (camp) {
  if (camp) {
    await Review.deleteMany({
      _id: {
        $in: camp.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
