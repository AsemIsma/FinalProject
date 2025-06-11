import { useFetch } from './useFetch';
import { useState, useReducer } from 'react';
import Dish from './Dish.jsx';

export default function App() {
  const { data, loading, error } = useFetch('https://foodster-idg1.onrender.com/api/dishes');
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [randomResult, setRandomResult] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("none");
  const [activeView, setActiveView] = useState('all'); // Initialize with 'all'
  const [selectedDish, setSelectedDish] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); // Items per page

  const dishSelectionReducer = (state, action) => {
  switch (action.type) {
    case 'SEARCH':
      return {
        view: 'search',
        dishes: action.payload || []
      };
    case 'RANDOM':
      return {
        view: 'random',
        dishes: action.payload ? [action.payload] : []
      };
    case 'CATEGORY':
      return {
        view: 'category',
        dishes: action.payload || []
      };
    case 'DETAIL':
      return {
        view: 'detail',
        dishes: action.payload ? [action.payload] : []
      };
    case 'RESET':
      return {
        view: 'all',
        dishes: action.payload || []
      };
    default:
      return state;
  }
};

// Initialize with your existing activeView and data
const [dishState, dispatchDishes] = useReducer(dishSelectionReducer, {
  view: 'all',
  dishes: data || []
});

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleViewChange = (newView) => {
  setActiveView(newView);
  setCurrentPage(1); // Always reset to first page
};

// Search
const handleSearchSubmit = (e) => {
  e.preventDefault();
  if (!searchInput.trim()) {
    dispatchDishes({ type: 'RESET', payload: data });
    return;
  }
  const filtered = data.filter(dish => 
    dish.dishName.toLowerCase().includes(searchInput.toLowerCase())
  );
  dispatchDishes({ type: 'SEARCH', payload: filtered });
};

// Random
const handleRandom = () => {
  const ranDish = Math.floor(Math.random() * data.length);
  dispatchDishes({ type: 'RANDOM', payload: data[ranDish] });
};

// Category
const handleCategoryChange = (event) => {
  const category = event.target.value;
  setSelectedCategory(category);
  
  if (category === "none") {
    dispatchDishes({ type: 'RESET', payload: data });
    return;
  }
  
  const filteredDishes = data.filter(dish => dish.category === category);
  dispatchDishes({ type: 'CATEGORY', payload: filteredDishes });
};

// Dish Click
const handleDishClick = (dishId) => {
  const dish = data.find(d => d.id === dishId);
  dispatchDishes({ type: 'DETAIL', payload: dish });
};

  
const getAllDishes = () => dishState.dishes;

const getCurrentPageDishes = () => {
  if (activeView === 'detail' && selectedDish) return [selectedDish];
  if (activeView === 'random') return randomResult ? [randomResult] : [];
  
  const allDishes = getAllDishes();
  return allDishes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
};


const Pagination = () => {
  const allDishes = getAllDishes();
  const totalPages = Math.ceil(allDishes.length / itemsPerPage);

  if (activeView === 'random' || totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button 
        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => setCurrentPage(i + 1)}
          className={currentPage === i + 1 ? 'active' : ''}
        >
          {i + 1}
        </button>
      ))}
      
      <button 
        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
      >
        Next
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
      
    <Dish 
  dishes={getAllDishes()} 
  viewMode={dishState.view} 
  onDishClick={handleDishClick}
/>

// Pagination condition
{dishState.view !== 'random' && dishState.view !== 'detail' && 
 getAllDishes().length > itemsPerPage && (
  <Pagination />
)}
    </>
  );
}