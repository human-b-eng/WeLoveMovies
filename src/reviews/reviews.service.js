const knex = require("../db/connection");

function readReview(reviewId) {
  return knex("reviews").where({ review_id: reviewId }).first();
}

function readCritic(criticId) {
  return knex("critics").where({ critic_id: criticId }).first();
}

function update(updatedReview) {
  return knex("reviews")
    .select("*")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*");
}

function destroy(review_id) {
  return knex("reviews").where({ review_id }).del();
}

module.exports = {
  read: readReview,
  readCritic,
  update,
  delete: destroy,
};