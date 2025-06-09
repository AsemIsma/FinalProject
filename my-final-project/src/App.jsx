import { useFetch } from './useFetch';

export default function App() {
  const { data, loading, error } = useFetch('https://foodster-idg1.onrender.com/api/dishes');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
console.log(data);
  return (
    <ul>
      {data.map((dish) => (
        <li key={dish.id}>{dish.dishName}</li>
      ))}
    </ul>
  );
}