import { useFetch } from './useFetch';
import { useState } from 'react';
import Dish from './Dish.jsx';

export default function App() {
  const { data, loading, error } = useFetch('https://foodster-idg1.onrender.com/api/dishes');
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState(null); // Initialize as null
  const [randomResult, setRandomResult] = useState(null); // Initialize as null
  const [activeView, setActiveView] = useState('all'); // 'all', 'search', or 'random'

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Search
  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      setSearchResults(null);
      setActiveView('all');
      return;
    }
    const filtered = data.filter(dish => 
      dish.dishName.toLowerCase().includes(searchInput.toLowerCase())
    );
    setSearchResults(filtered);
    setActiveView('search');
    setRandomResult(null); // Clear random result when searching
  };

  // Random
  const handleRandom = () => {
    const ranDish = Math.floor(Math.random() * data.length);
    setRandomResult(data[ranDish]);
    setActiveView('random');
    setSearchResults(null); // Clear search results when getting random
  };

  // Determine which dishes to display
  const getDisplayDishes = () => {
    switch (activeView) {
      case 'search':
        return searchResults || [];
      case 'random':
        return randomResult ? [randomResult] : [];
      default:
        return []; 
    }
  };

  return (
    <>
      <div className="searchbar-cont">
        <form onSubmit={handleSearchSubmit}>
          <input 
            type="text"
            value={searchInput}
            onChange={handleSearchInputChange}
            placeholder="Search dishes..."
          />
          <button type="submit" className="sub-btn">Search</button>
        </form>
        <button className="random-btn" onClick={handleRandom}>random</button>

        <select id="selector" name="category">
          <option value="none">Select category</option>
          <option value="main dish">Main dish</option>
          <option value="dessert">Dessert</option>
          <option value="snack">Snack</option>
        </select>
      </div>
      
      <div className="container"></div> 
      <div className="pagination"></div>
      
      <Dish dishes={getDisplayDishes()} />
    </>
  );
}