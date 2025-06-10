function Dish (props) {
    const { dishes } = props;
    console.log(dishes, "asdfghjk")
    return (
        <>
<div>
    {/* First check if dishes exists and is non-empty */}
    {dishes && dishes.length > 0 ? (
      // If we have dishes, render them
      dishes.map((dish) => (
        <div className='dish' id={'a' + dish.id} key={dish.id}>
          <p>{dish.dishName}</p>
          <img className='img' src={dish.dishImgSrc} alt={dish.dishName} />
        </div>
      ))
    ) : dishes && !Array.isArray(dishes) ? (
      // If dishes is a single object (not array), render detailed view
      <div className='dish' id={'a' + dishes.id} key={dishes.id}>
        <h1 className="ran search-name">{dishes.dishName}</h1>
        <img className="ran search-img" src={dishes.dishImgSrc} alt={dishes.dishName} />
        <p className="title">Ingredients:</p>
        <div dangerouslySetInnerHTML={{ 
          __html: dishes.dishIngredients.map(el => el.join(' ')).join('<br>')
        }} />
        <p className="title">Preparation steps:</p>
        <div dangerouslySetInnerHTML={{
          __html: "-" + dishes.dishPrepSteps.join('<br><br>-')
        }} />
        <a className="src" href={dishes.source}>Source</a>
        <p>author: {dishes.author}</p>
      </div>
    ) : (
      // Fallback when dishes is empty/undefined
      <p>No dishes found</p>
    )}
  </div>
        </>
    )
}

export default Dish;