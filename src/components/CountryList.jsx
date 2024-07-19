import Spinner from "./Spinner";
import Message from "./Message";
import CountryItem from "./CountryItem";
import styles from "./CountryList.module.css";
import { useCities } from "../context/CitiesContext";

export default function CountryList() 
{
  const {cities, isLoading} = useCities();

  if (isLoading) return <Spinner />;
  if(!cities.length) return <Message message="Add your first country by clicking the"/>

  const countries = cities.reduce((array, city) => 
    {
    if (!array.map(element => element.country).includes(city.country)) 
    {
      return [...array, { country: city.country, emoji: city.emoji }];
    } 
    else 
    {
      return array;
    }
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map(country => <CountryItem country={country} key={Math.floor(Math.random() * 1000000)}/>)}
    </ul>
  );
}