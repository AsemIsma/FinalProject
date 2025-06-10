function Dish({ dishes, viewMode }) {
  if (!dishes || dishes.length === 0) {
    return <p>No dishes found</p>;
  }

  // Handle single dish view (random)
  if (viewMode === 'random' || !Array.isArray(dishes)) {
    const dish = Array.isArray(dishes) ? dishes[0] : dishes;
    return (
      <div className='dish-detail'>
        {/* Your detailed dish view */}
      </div>
    );
  }

  // Handle grid view
  return (
    <>
    <div className="dishes-grid">
      {dishes.map(dish => (
        <div key={dish.id} className="dish-card">
          {/* Your dish card content */}
        </div>
      ))}
    </div>
        </>
    )
}

export default Dish;