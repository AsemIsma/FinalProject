function Dish (props) {
    const { dishes } = props;
    console.log(dishes, "asdfghjk")
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