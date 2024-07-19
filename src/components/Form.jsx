// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useUrlLocation } from "../hooks/useUrlPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../context/CitiesContext";

export function ConvertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

export function FlagEmojiToPNG(flag)
{
  const countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt())
    .map(char => String.fromCharCode(char - 127397).toLowerCase())
    .join("");
  return(
    <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt={flag}/>
  )
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() 
{
  const navigate = useNavigate();
  const {createCity, isLoading} = useCities();

  const [lat, lng] = useUrlLocation();
  const [cityName, SetCityName] = useState("");
  const [country, SetCountry] = useState("");
  const [date, SetDate] = useState(new Date());
  const [notes, SetNotes] = useState("");
  const [emoji, SetEmoji] = useState("");
  const [isLoadingGeolocation, SetIsLoadingGeolocation] = useState(false);
  const [geolocationError, SetGeolocationError] = useState("");



  useEffect(function() 
  {
    if(!lat && !lng) return;

    async function FetchCityData()
    {
      try
      {
        SetIsLoadingGeolocation(true);
        SetGeolocationError("");

        const response = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`)
        const data = await response.json();
        if(!data.countryCode) throw new Error("That doesnt seem to be a city. Click somewhere else.")

        SetCityName(data.city || data.locality || "");
        SetCountry(data.countryName);
        SetEmoji(ConvertToEmoji(data.countryCode));
      }
      catch(error)
      {
        SetGeolocationError(error.message);
      }
      finally
      {
        SetIsLoadingGeolocation(false)
      }
    }
    FetchCityData();
  }, [lat,lng]);

  async function HandleSubmit(event)
  {
    event.preventDefault();

    if(!cityName || !date) return;

    const newCity = 
    {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {lat,lng}
    }

    await createCity(newCity);
    navigate("/app");
  }

  if(isLoadingGeolocation) return <Spinner />;
  if(!lat && !lng) return <Message message="Start by clicking somewhere on the map" />
  if(geolocationError) return <Message message={geolocationError}/>;

  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ""}`} onSubmit={HandleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => SetCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji && FlagEmojiToPNG(emoji)}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker 
          id="date"
          onChange={date => SetDate(date)} 
          selected={date} 
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => SetNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type={"primary"}>Add</Button>
        <Button type={"back"} onClick={(event)=>{event.preventDefault(); navigate(-1)}}>&larr; Back</Button>
      </div>
    </form>
  );
}

export default Form;
