import { useFetch } from './useFetch';
import { useState, useEffect } from 'react';
import Dish from './Dish.jsx';

export default function App() {
  const { data, loading, error } = useFetch('https://foodster-idg1.onrender.com/api/dishes');
  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("none");
  const [data1, setData1] = useState([]);

  // Initialize data1 when data loads
  useEffect(() => {
    if (data) {
      setData1(data);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // ===== SEARCH =====
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const value = inputValue.toLowerCase();
    const filteredResults = data1.filter(el => 
      el.dishName.toLowerCase().includes(value)
    );
    setSearchResults(filteredResults);
    setCurrentPage(1);
    setInputValue("");
  };

  // ===== RENDER SEARCH PAGE =====
  const renderSearchPage = (pageNumber) => {
    const itemsPerPage = 3;
    const start = (pageNumber - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return searchResults.slice(start, end);
  };

  const currentItems = renderSearchPage(currentPage);

  // ===== RANDOM =====
  const handleRandomClick = () => {
    const ranDish = Math.floor(Math.random() * data1.length);
    setSearchResults([data1[ranDish]]);
    setCurrentPage(1);
  };

  // ===== CATEGORY FILTER =====
  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    setSelectedCategory(cat);
    if (["main dish", "dessert", "snack"].includes(cat)) {
      const filtered = data1.filter(el => el.category === cat);
      setSearchResults(filtered);
      setCurrentPage(1);
    } else {
      setSearchResults([]);
    }
  };

  // ===== OPEN ONE FULL RECIPE PAGE =====
  const handleRecipeClick = (elId) => {
    const dish = data1.find(d => d.id === elId);
    if (dish) {
      setSearchResults([dish]);
    }
  };

  // Helper function to render HTML content safely
  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  return (
    <>
      <div className="searchbar-cont">
        <form onSubmit={handleSearchSubmit}>
          <input 
            type="text" 
            className="input" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" className="sub-btn">Search</button>
        </form>
        <button className="random-btn" onClick={handleRandomClick}>random</button>

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
        {searchResults.length === 0 && selectedCategory === "none" ? (
          <h1 className="search-name">Please choose a category or search.</h1>
        ) : (
          currentItems.map(el => (
            <div 
              key={el.id} 
              className="search-cont-pag" 
              onClick={() => handleRecipeClick(el.id)}
            >
              <h1 className="search-name">{el.dishName}</h1>
              <img className="search-img" src={el.dishImgSrc} alt={el.dishName} />
            </div>
          ))
        )}
      </div>

      {searchResults.length > 3 && (
        <div className="pagination">
          {Array.from(
            { length: Math.ceil(searchResults.length / 3) }, 
            (_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      )}

      {searchResults.length === 1 && (
        <div className="search-cont">
          <h1 className="ran search-name">{searchResults[0].dishName}</h1>
          <img className="ran search-img" src={searchResults[0].dishImgSrc} alt={searchResults[0].dishName} />
          <p className="title">Ingredients:</p>
          <div dangerouslySetInnerHTML={createMarkup(
            searchResults[0].dishIngredients.map(el => el.join(' ')).join('<br>')
          )} />
          <p className="title">Preparation steps:</p>
          <div dangerouslySetInnerHTML={createMarkup(
            "-" + searchResults[0].dishPrepSteps.join('<br><br>-')
          )} />
          <a className="src" href={searchResults[0].source}>Source</a>
          <p>author: {searchResults[0].author}</p>
        </div>
      )}

      <Dish dishes={data} />
    </>
  );
}