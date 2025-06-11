import { useFetch } from './useFetch';
import { useState, useEffect, useReducer } from 'react';
import Dish from './Dish.jsx';

// Reducer for dish state management
const dishReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        allDishes: action.payload,
        filteredDishes: action.payload,
        view: 'all'
      };
    case 'SEARCH':
      return {
        ...state,
        filteredDishes: action.payload,
        view: 'search'
      };
    case 'RANDOM':
      return {
        ...state,
        filteredDishes: [action.payload],
        view: 'random'
      };
    case 'FILTER_CATEGORY':
      return {
        ...state,
        filteredDishes: action.payload,
        view: 'category'
      };
    case 'RESET':
      return {
        ...state,
        filteredDishes: state.allDishes,
        view: 'all'
      };
    case 'SHOW_DETAIL':
      return {
        ...state,
        filteredDishes: [action.payload],
        view: 'detail'
      };
    default:
      return state;
  }
};

export default function App() {
  const { data, loading, error } = useFetch('https://foodster-idg1.onrender.com/api/dishes');
  const [dishState, dispatch] = useReducer(dishReducer, {
    allDishes: [],
    filteredDishes: [],
    view: 'all'
  });
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("none");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Initialize data
  useEffect(() => {
    if (data) {
      dispatch({ type: 'SET_DATA', payload: data });
    }
  }, [data]);

  // Search handler
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    
    if (!searchInput.trim()) {
      dispatch({ type: 'RESET' });
      return;
    }

    const filtered = dishState.allDishes.filter(dish =>
      dish.dishName.toLowerCase().includes(searchInput.toLowerCase())
    );
    dispatch({ type: 'SEARCH', payload: filtered });
  };

  // Random handler
  const handleRandom = () => {
    setCurrentPage(1);
    const randomIndex = Math.floor(Math.random() * dishState.allDishes.length);
    dispatch({ type: 'RANDOM', payload: dishState.allDishes[randomIndex] });
  };

  // Category handler
  const handleCategoryChange = (e) => {
    setCurrentPage(1);
    const category = e.target.value;
    setSelectedCategory(category);

    if (category === "none") {
      dispatch({ type: 'RESET' });
      return;
    }

    const filtered = dishState.allDishes.filter(dish => dish.category === category);
    dispatch({ type: 'FILTER_CATEGORY', payload: filtered });
  };

  const handleDishClick = (dish) => {
  dispatch({ 
    type: 'SHOW_DETAIL', 
    payload: dish 
  });
  setCurrentPage(1);
};

  // Get current dishes for pagination
  const getCurrentDishes = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return dishState.filteredDishes.slice(startIndex, startIndex + itemsPerPage);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="app">
      <div className="searchbar-cont">
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search dishes..."
          />
          <button type="submit">Search</button>
        </form>
        
        <button onClick={handleRandom}>Random</button>
        
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="none">All Categories</option>
          <option value="main dish">Main Dishes</option>
          <option value="dessert">Desserts</option>
          <option value="snack">Snacks</option>
        </select>
      </div>

      <div className="container">
        <Dish 
        dishes={getCurrentDishes()}
        viewMode={dishState.view}
        onDishClick={handleDishClick}  // Add this prop
      />
      </div>

      {dishState.view !== 'random' && dishState.filteredDishes.length > itemsPerPage && (
        <div className="pagination">
          {Array.from({ 
            length: Math.ceil(dishState.filteredDishes.length / itemsPerPage) 
          }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}