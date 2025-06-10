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
    setCurrentPage(1);
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
    setCurrentPage(1);
    const ranDish = Math.floor(Math.random() * data.length);
    setRandomResult(data[ranDish]);
    setActiveView('random');
    setSearchResults(null);
  };

  // Category
  const handleCategoryChange = (event) => {
    setCurrentPage(1);
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
  
  const getPaginatedDishes = () => {
  const allDishes = getDisplayDishes();
  const startIndex = (currentPage - 1) * itemsPerPage;
  return allDishes.slice(startIndex, startIndex + itemsPerPage);
};
 
 const Pagination = ({ totalItems }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button 
        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
      
      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        let pageNum;
        if (totalPages <= 5) {
          pageNum = i + 1;
        } else if (currentPage <= 3) {
          pageNum = i + 1;
        } else if (currentPage >= totalPages - 2) {
          pageNum = totalPages - 4 + i;
        } else {
          pageNum = currentPage - 2 + i;
        }
        
        return (
          <button
            key={pageNum}
            onClick={() => setCurrentPage(pageNum)}
            className={currentPage === pageNum ? 'active' : ''}
          >
            {pageNum}
          </button>
        );
      })}
      
      <button 
        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
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
    
    {/* Only show pagination for grid views */}
    {(activeView === 'search' || activeView === 'category' || activeView === 'all') && 
     getDisplayDishes().length > itemsPerPage && (
      <Pagination totalItems={getDisplayDishes().length} />
    )}
    </>
  );
}