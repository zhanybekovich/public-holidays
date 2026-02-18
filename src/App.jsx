import { use, useEffect, useState } from "react";
import Error from "./components/Error";
import Loader from "./components/Loader";
import NotFound from "./components/NotFound";

// https://openholidaysapi.org/Countries?languageIsoCode=DE
// https://openholidaysapi.org/PublicHolidays?countryIsoCode=DE&validFrom=2023-01-01&validTo=2023-12-31&languageIsoCode=DE&subdivisionCode=DE-BE

const API_BASE_URL = "https://openholidaysapi.org";
const LANGUAGE = "EN";
const VALID_FROM = "2025-01-01";
const VALID_TO = "2015-12-31";
const DEFAULT_COUNTRY = "NL";

const dateFormat = {
  day: "numeric",
  month: "long",
};

function App() {
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [errorCountries, setErrorCountries] = useState(null);
  const [countries, setCountries] = useState([]);

  const [loadingHolidays, setLoadingHolidays] = useState(false);
  const [errorHolidays, setErrorHolidays] = useState(null);
  const [holidays, setHolidays] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");

  async function getCountries() {
    try {
      setLoadingCountries(true);
      setErrorCountries(null);

      const res = await fetch(
        `${API_BASE_URL}/Countries?languageIsoCode=${LANGUAGE}`,
      );

      if (!res.ok) {
        throw new Error();
      }

      const data = await res.json();

      setCountries(data);
    } catch {
      setErrorCountries("Error loading countries...");
    } finally {
      setLoadingCountries(false);
    }
  }

  async function getHolidays(countryCode) {
    try {
      setLoadingHolidays(true);
      setErrorHolidays(null);

      const res = await fetch(
        `${API_BASE_URL}/PublicHolidays?countryIsoCode=${countryCode}&validFrom=${VALID_FROM}&validTo=${VALID_TO}&languageIsoCode=${LANGUAGE}`,
      );

      if (!res.ok) {
        throw new Error();
      }

      const data = await res.json();
      setHolidays(data);
    } catch {
      setErrorHolidays("Error fetching holidays...");
    } finally {
      setLoadingHolidays(false);
    }
  }

  function handleChange(isoCode) {
    setSelectedCountry(isoCode);
  }

  useEffect(() => {
    getCountries();
  }, []);

  useEffect(() => {
    if (countries.length === 0) return;

    const defaultCountry = countries.find((c) => c.isoCode === DEFAULT_COUNTRY);

    if (defaultCountry) {
      setSelectedCountry(defaultCountry.isoCode);
    } else {
      setSelectedCountry(countries[0].isoCode);
    }
  }, [countries]);

  useEffect(() => {
    if (!selectedCountry) return;

    getHolidays(selectedCountry);
  }, [selectedCountry]);

  return (
    <div className="min-h-screen flex justify-center">
      <div className="my-8 shadow-2xl w-[40%] flex flex-col gap-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-semibold uppercase tracking-widest">
            Public Holidays
          </h1>
        </div>

        {loadingCountries ? (
          <div className="w-16 mx-auto">
            <Loader />
          </div>
        ) : errorCountries ? (
          <div>
            <Error message={errorCountries} />
          </div>
        ) : countries.length === 0 ? (
          <div>
            <NotFound message="Sorry, no countries found." />
          </div>
        ) : (
          <div className="flex justify-center">
            <select
              onChange={(e) => handleChange(e.target.value)}
              value={selectedCountry}
              name="countries"
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              {countries.map((item) => (
                <option key={item.isoCode} value={item.isoCode}>
                  {item.name[0].text}
                </option>
              ))}
            </select>
          </div>
        )}

        {loadingHolidays ? (
          <div className="w-16 mx-auto">
            <Loader />
          </div>
        ) : errorHolidays ? (
          <div>
            <Error message={errorHolidays} />
          </div>
        ) : holidays.length === 0 ? (
          <div>
            <NotFound message="Sorry, no holidays found." />
          </div>
        ) : (
          <ul className="list-disc flex flex-col gap-4 px-8">
            {holidays.map((item) => (
              <li key={item.id}>
                {new Intl.DateTimeFormat("ky-KG", dateFormat).format(
                  new Date(item.startDate),
                )}{" "}
                - {item.name[0].text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
