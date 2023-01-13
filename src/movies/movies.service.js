const knex = require("../db/connection");

function list() {
  return knex("movies")
  .select(
    "movie_id as id",
    "title",
    "runtime_in_minutes",
    "rating",
    "description",
    "image_url"
  );
}

function isShowingList() {
  return knex("movies as m")
    .join("movies_theaters as mt", "mt.movie_id", "m.movie_id")
    .select(
      "m.movie_id as id",
      "m.title",
      "m.runtime_in_minutes",
      "m.rating",
      "m.description",
      "m.image_url"
    )
    .where({ "mt.is_showing": true })
    .groupBy("id", "mt.is_showing")
}

function read(movieId) {
  return knex("movies").select("*").where({ movie_id: movieId }).first();
}

function theatersPlaying(movieId) {
  return knex("theaters as t")
  .join("movies_theaters as mt", "mt.theater_id", "t.theater_id")
  .join("movies as m", "m.movie_id", "mt.movie_id")
  .where({"m.movie_id": movieId})
}

function movieReviews(movieId) {
  return knex("reviews as r")
  .join("movies as m", "m.movie_id", "r.movie_id")
  .where({"r.movie_id": movieId})
}

module.exports = {
  list,
  isShowingList,
  read,
  theatersPlaying,
  movieReviews,
};