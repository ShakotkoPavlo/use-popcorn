import "./App.css";
import Box from "./Box";
import Logo from "./Logo";
import NavBar from "./NavBar";
import Loader from "./Loader";
import Search from "./Search";
import MovieList from "./MovieList";
import NumResults from "./NumResults";
import MovieDetails from "./MovieDetails";
import MainComponent from "./MainComponent";
import { useEffect, useState } from "react";
import WatchedSummary from "./WatchedSummary";
import WatchedMoviesList from "./WatchedMoviesList";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

export default function App() {
  const [watched, setWatched] = useLocalStorageState("watched", []);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const { movies, isLoading, error } = useMovies(query);

  function onSelectMovie(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function onAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function onCloseMovie() {
    setSelectedId(null);
  }

  function onDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useKey("Escape", onCloseMovie);

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
