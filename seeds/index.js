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
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      image:
        "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2940&q=80",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Beatae repellat nobis, tenetur harum iste numquam eius enim deleniti. Aliquid praesentium laborum, illum at magnam cupiditate veritatis optio? Voluptatum, ullam nostrum?",
      price,
    });
    await camp.save();
  }
};

seedDB().then(console.log("Seeding Success"));
