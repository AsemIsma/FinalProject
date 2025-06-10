function Dish({ dishes, viewMode }) {
  if (!dishes || dishes.length === 0) {
    if (!dishes) return <p>Loading...</p>;
    return <p>No dishes found</p>;
  }

  // Handle single dish view (random)
  if (viewMode === 'random' || !Array.isArray(dishes)) {
    const dish = Array.isArray(dishes) ? dishes[0] : dishes;
    return (
      <div className='dish-detail'>
        <div className="search-cont">
            <h1 className="ran search-name">{dish.dishName}</h1>
            <img className="ran img" src={dish.dishImgSrc}/>
            <p className="title">Ingredients:</p>
            <p>{dish.dishIngredients.map(el => el.join(' ')).join(', ')}</p>
            <p className="title">Preparation steps:</p>
            <p>-{dish.dishPrepSteps.join(',  -')}</p>
            <a className="src" href={dish.source}>Source</a>
            <p>author: {dish.author}</p>
        </div>
      </div>
    );
  }

  // Handle grid view
  return (
    <>
    <div className="dishes-grid">
      {dishes.map(dish => (
        <div key={dish.id} className="dish-card">
          <p>{dish.dishName}</p>
          <img className="img" src={dish.dishImgSrc}/>
        </div>
      ))}
    </div>
        </>
    )
}

export default Dish;