import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import Loader from "./Loader";
const API_KEY = "b530df92";

export default function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watched,
}) {
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const countRef = useRef(0);

  useEffect(
    function () {
      if (userRating) {
        countRef.current++;
      }
    },
    [userRating],
  );

  const isWatched = watched.some((movie) => movie.imdbID === selectedId)
    ? true
    : false;

  const watchedRating = watched.find(
    (movie) => movie.imdbID === selectedId,
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    Actors: actors,
    Director: director,
    Genre: genre,
    Released: released,
    imdbRating: imdbRating,
    Plot: plot,
  } = movie || {};

  function onAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      Title: title,
      Year: year,
      Poster: poster,
      runtime: parseInt(runtime.split(" ")[0]),
      imdbRating: Number(imdbRating),
      userRating,
      countRatingDecisions: countRef.current,
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useEffect(
    function () {
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "Use popcorn";
      };
    },
    [title],
  );

  useEffect(
    function () {
      async function fetchMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedId}`,
        );

        if (!res.ok) {
          throw new Error("Something went wrong fetching movies");
        }

        const data = await res.json();

        setIsLoading(false);
        setMovie(data);
      }
      fetchMovieDetails();
    },
    [selectedId],
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {year} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span> {imdbRating} IMDb Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {isWatched ? (
                <p>You rated this movie {watchedRating} ⭐</p>
              ) : (
                <StarRating
                  size={24}
                  defaultRating={imdbRating}
                  maxRating={10}
                  onSetRating={setUserRating}
                />
              )}

              {userRating > 0 && (
                <button className="btn-add" onClick={onAdd}>
                  Add movie
                </button>
              )}
            </div>
            <p>
              <strong>Plot:</strong> {plot}
            </p>
            <p>
              <strong>Directed by:</strong> {director}
            </p>
            <p>
              <strong>Actors:</strong> {actors}
            </p>
            <p>
              <strong>Released:</strong> {released}
            </p>
          </section>
        </>
      )}
    </div>
  );
}
