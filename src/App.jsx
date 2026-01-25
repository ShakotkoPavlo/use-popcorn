import "./App.css";
import NavBar from "./NavBar";
import MainComponent from "./MainComponent";
import { useEffect, useState } from "react";
import Search from "./Search";
import NumResults from "./NumResults";
import Logo from "./Logo";
import Box from "./Box";
import MovieList from "./MovieList";
import WatchedSummary from "./WatchedSummary";
import WatchedMoviesList from "./WatchedMoviesList";
import MovieDetails from "./MovieDetails";
import Loader from "./Loader";

const API_KEY = "b530df92";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function onSelectMovie(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function onCloseMovie() {
    setSelectedId(null);
  }

  function onAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function onDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(
    function () {
      function handleKeyDown(e) {
        if (e.key === "Escape") {
          onCloseMovie();
        }
      }
      document.addEventListener("keydown", handleKeyDown);

      return function () {
        document.removeEventListener("keydown", handleKeyDown);
      };
    },
    [onCloseMovie],
  );

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`,
            { signal: controller.signal },
          );

          if (!res.ok) {
            throw new Error("Something went wrong fetching movies");
          }

          const data = await res.json();

          if (data.Response === "False") {
            throw new Error("Movie not found");
          }

          setMovies(data.Search);
        } catch (error) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      onCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query],
  );

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults>{movies.length}</NumResults>
      </NavBar>
      <MainComponent>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={onSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={onCloseMovie}
              onAddWatched={onAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={onDeleteWatched}
              />
            </>
          )}
        </Box>
      </MainComponent>
    </>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span> {message}
    </p>
  );
}
