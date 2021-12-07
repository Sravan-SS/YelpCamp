module.exports.CSPDirectives = {
  defaultSrc: [],
  connectSrc: [
    "'self'",
    "https://api.mapbox.com/",
    "https://events.mapbox.com/",
  ],
  scriptSrc: [
    "'unsafe-inline'",
    "'self'",
    "https://api.mapbox.com/",
    "https://cdn.jsdelivr.net/",
  ],
  styleSrc: [
    "'self'",
    "'unsafe-inline'",
    "https://cdn.jsdelivr.net/",
    "https://api.mapbox.com/",
  ],
  workerSrc: ["'self'", "blob:"],
  objectSrc: [],
  imgSrc: [
    "'self'",
    "blob:",
    "data:",
    "https://images.unsplash.com/",
    "https://res.cloudinary.com/sravn/image/upload/",
  ],
  fontSrc: ["'self'"],
};
