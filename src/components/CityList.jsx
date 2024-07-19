import Spinner from "./Spinner";
import Message from "./Message";
import CityItem from "./CityItem";
import styles from "./CityList.module.css";
import { useCities } from "../context/CitiesContext";

export default function CityList() 
{
  const {cities, isLoading} = useCities();
  
  if (isLoading) return <Spinner />;
  if(!cities.length) return <Message message="Add your first city by clicking the"/>

  return (
    <ul className={styles.cityList}>
      {cities.map(city => <CityItem city={city} key={city.id} />)}
    </ul>
  );
}