function Dish({ dishes, viewMode, onDishClick }) {
  if (!dishes || dishes.length === 0) return <p>No dishes found</p>;

  // Detailed view
  if (viewMode === 'detail' || viewMode === 'random' || !Array.isArray(dishes)) {
    const dish = Array.isArray(dishes) ? dishes[0] : dishes;
    return (
      <div className="dish-detail">
        <h1>{dish.dishName}</h1>
        <img src={dish.dishImgSrc} alt={dish.dishName} />
        <div className="ingredients">
          <h3>Ingredients:</h3>
          <ul>
            {dish.dishIngredients.map((ingredient, i) => (
              <li key={i}>{ingredient.join(' ')}</li>
            ))}
          </ul>
        </div>
        <div className="instructions">
          <h3>Instructions:</h3>
          <ol>
            {dish.dishPrepSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
        <a href={dish.source} className="source-link">View Source</a>
      </div>
    );
  }

  // Grid view
  return (
    <div className="dishes-grid">
      {dishes.map(dish => (
        <div 
          key={dish.id} 
          className="dish-card"
          onClick={() => onDishClick(dish.id)}
        >
          <h3>{dish.dishName}</h3>
          <img src={dish.dishImgSrc} alt={dish.dishName} />
        </div>
      ))}
    </div>
  );
}

export default Dish;