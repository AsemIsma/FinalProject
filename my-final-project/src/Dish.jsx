function Dish (props) {
  const { dishes } = props;
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

    return (
        <>
         <div>
          {dishes.map((dish) => (
          <div className='dish' id={'a' + dish.id} key={dish.id}>
          <p>{dish.dishName}</p>
          <img className='img' src={dish.dishImgSrc}/>
        </div>
      ))}
    </div>
        </>
    )
}

export default Dish;