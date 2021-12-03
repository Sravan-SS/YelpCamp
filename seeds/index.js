const mongoose = require("mongoose");
const Campground = require("../models/campground");
const { places, descriptors } = require("./seedHelpers");
const cities = require("./cities");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedtopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => {
  console.log("Database Connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "618e86841a805f93f5a12982",
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Beatae repellat nobis, tenetur harum iste numquam eius enim deleniti. Aliquid praesentium laborum, illum at magnam cupiditate veritatis optio? Voluptatum, ullam nostrum?",
      price,
      geometry: { type: "Point", coordinates: [75.933324, 11.33897] },
      images: [
        {
          url: "https://res.cloudinary.com/sravn/image/upload/v1637143284/YelpCamp/scoo9x9cmifix58gx1ku.jpg",
          filename: "YelpCamp/scoo9x9cmifix58gx1ku",
        },
        {
          url: "https://res.cloudinary.com/sravn/image/upload/v1637143286/YelpCamp/wvzb82sbcwm3c5c1af0.jpg",
          filename: "YelpCamp/wvzb82sbcwm3c5c1af0",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(console.log("Seeding Success"));
