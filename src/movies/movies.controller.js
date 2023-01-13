const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const { is_showing } = req.query;
  let data;
  if (is_showing === "true") {
    data = await service.isShowingList();
  } else {
    data = await service.list();
  }
  res.status(200).json({ data });
}

async function movieExists(req, res, next) {
  const { movieId } = req.params;
  const matchingMovie = await service.read(Number(movieId));
  if (matchingMovie) {
    res.locals.movie = matchingMovie;
    return next();
  }
  next({ status: 404, message: "Movie cannot be found." });
}

async function read(req, res) {
  res.json({ data: res.locals.movie });
}

async function theatersPlaying(req, res) {
  const data = await service.theatersPlaying(req.params.movieId);
  res.json({ data })
}

async function movieReviews(req, res) {
  const data = await service.movieReviews(res.locals.movie.movie_id);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
  theatersPlaying: [asyncErrorBoundary(movieExists), asyncErrorBoundary(theatersPlaying)],
  movieExists,
  movieReviews: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(movieReviews),
  ],
};