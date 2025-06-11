function Dish({ dishes, viewMode, onDishClick }) {  // Make sure to destructure the prop
  if (!dishes || dishes.length === 0) {
    return <div className="no-dishes">No dishes found</div>;
  }

  if (viewMode === 'random' || viewMode === 'detail' || !Array.isArray(dishes)) {
    const dish = Array.isArray(dishes) ? dishes[0] : dishes;
    return (
      <div className="dish-detail">
        <h2>{dish.dishName}</h2>
        <img src={dish.dishImgSrc} alt={dish.dishName} />
        <h3>Ingredients</h3>
        <ul>
          {dish.dishIngredients.map((ing, i) => (
            <li key={i}>{ing.join(' ')}</li>
          ))}
        </ul>
        <h3>Instructions</h3>
        <ol>
          {dish.dishPrepSteps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <div className="dishes-grid">
      {dishes.map(dish => (
        <div 
          key={dish.id} 
          className="dish-card"
          onClick={() => onDishClick(dish)}  // Add click handler
        >
          <h3>{dish.dishName}</h3>
          <img src={dish.dishImgSrc} alt={dish.dishName} />
        </div>
      ))}
    </div>
  );
}

export default Dish;