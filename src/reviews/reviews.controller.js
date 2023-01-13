const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const VALID_PROPERTIES = [
  "content",
  "score",
  "movie_id",
  "critic_id",
  "created_at",
  "updated_at",
];

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length)
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  next();
}

async function reviewExists(req, res, next) {
  const { reviewId } = req.params;
  const matchingReview = await service.read(Number(reviewId));
  if (matchingReview) {
    res.locals.review = matchingReview;
    return next();
  }
  next({ status: 404, message: "Review cannot be found." });
}

async function update(req, res) {
  const updatedReview = {
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };

  await service.update(updatedReview);
  const reviewData = await service.read(req.params.reviewId);
  const criticData = await service.readCritic(reviewData.critic_id);
  const data = { ...reviewData, critic: criticData };
  res.json({ data });
}

async function destroy(req, res) {
  const { review } = res.locals;
  await service.delete(review.review_id);
  res.sendStatus(204);
}

module.exports = {
  update: [
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(hasOnlyValidProperties),
    asyncErrorBoundary(update),
  ],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};