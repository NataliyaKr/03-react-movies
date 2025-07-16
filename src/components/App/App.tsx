import { useState } from "react";
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import toast, { Toaster } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import css from "./App.module.css";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSubmit = async (query: string) => {
    try {
      setMovies([]);
      setIsLoading(true);
      setIsError(false);
      setSelectedMovie(null);

      const newMovies = await fetchMovies(query);
      if (newMovies.length === 0) {
        toast("No movies found for your request", {
          duration: 2000,
          position: "top-center",
        });
      }
      setMovies(newMovies);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (movie: Movie) => {
    setIsModalOpen(true);
    setSelectedMovie(movie);
  };
  const handleModalClose = () => {
    setSelectedMovie(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className={css.app}>
        <SearchBar onSubmit={handleSubmit} />
        <Toaster />
        {isLoading && <Loader />}
        {isError && <ErrorMessage />}
        {movies.length > 0 && (
          <MovieGrid onSelect={handleSelect} movies={movies} />
        )}
        {isModalOpen && selectedMovie && (
          <MovieModal movie={selectedMovie} onClose={handleModalClose} />
        )}
      </div>
    </>
  );
}

export default App;
