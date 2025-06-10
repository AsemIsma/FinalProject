import { useFetch } from './useFetch';
import { useState } from 'react';
import Dish from './Dish.jsx';

export default function App() {
  const { data, loading, error } = useFetch('https://foodster-idg1.onrender.com/api/dishes');
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [randomResult, setRandomResult] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("none");
  const [activeView, setActiveView] = useState('all'); // Initialize with 'all'

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // Items per page

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
    setRandomResult(null);
  };

  // Random
  const handleRandom = () => {
    const ranDish = Math.floor(Math.random() * data.length);
    setRandomResult(data[ranDish]);
    setActiveView('random');
    setSearchResults(null);
  };

  // Category
  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    
    if (category === "none") {
      setSearchResults(null);
      setActiveView('all');
      return;
    }
    
    const filteredDishes = data.filter(dish => dish.category === category);
    setSearchResults(filteredDishes);
    setActiveView('category'); // Set the view mode to 'category'
  };

  // Determine which dishes to display
  const getDisplayDishes = () => {
  switch (activeView) {
    case 'search': return searchResults || [];
    case 'random': return randomResult ? [randomResult] : [];
    case 'category': return searchResults || [];
    default: return data || []; 
  }
};
  
  // Add this new function for paginated dishes
const getPaginatedDishes = () => {
  const allDishes = getDisplayDishes();
  const startIndex = (currentPage - 1) * itemsPerPage;
  return allDishes.slice(startIndex, startIndex + itemsPerPage);
};
 
  // Add this Pagination component
const Pagination = ({ totalItems }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  return (
    <div className="pagination">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => setCurrentPage(i + 1)}
          className={currentPage === i + 1 ? 'active' : ''}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
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

        <select 
          id="selector" 
          name="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="none">Select category</option>
          <option value="main dish">Main dish</option>
          <option value="dessert">Dessert</option>
          <option value="snack">Snack</option>
        </select>
      </div>
      
      <div className="container">
      <Dish dishes={getPaginatedDishes()} viewMode={activeView} />
    </div>
    {getDisplayDishes().length > itemsPerPage && <Pagination />}
    </>
  );
}