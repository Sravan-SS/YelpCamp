const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync");
const { isLoggedin, isAuthor, validateCampground } = require("../middleware");

// index,create
router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedin,
    validateCampground,
    catchAsync(campgrounds.createCampground)
  );

// new
router.get("/new", isLoggedin, campgrounds.renderNewForm);

// show update delete
router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedin,
    isAuthor,
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedin, isAuthor, catchAsync(campgrounds.deleteCampground));

// edit
router.get(
  "/:id/edit",
  isLoggedin,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
