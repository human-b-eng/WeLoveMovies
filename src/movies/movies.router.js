const router = require("express").Router();
const controller = require("./movies.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const reviewsRouter = require("../reviews/reviews.router");

router.use("/:movieId/reviews", controller.movieExists, reviewsRouter);

router
  .route("/:movieId/theaters")
  .get(controller.listTheatersPlayingMovie)
  .all(methodNotAllowed);

router.route("/:movieId").get(controller.read).all(methodNotAllowed);

router.route("/").get(controller.list).all(methodNotAllowed);

module.exports = router;