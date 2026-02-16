import { useEffect, useState } from "react";
import Error from "./components/Error";
import Loader from "./components/Loader";
import NotFound from "./components/NotFound";

// https://openholidaysapi.org/Countries?languageIsoCode=DE

const API_BASE_URL = "https://openholidaysapi.org";
const LANGUAGE = "EN";

function App() {
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [error, setError] = useState(null);

  async function getCountries() {
    try {
      setLoadingCountries(true);
      setError(null);

      const res = await fetch(
        `${API_BASE_URL}/Countries?languageIsoCode=${LANGUAGE}`,
      );

      const data = await res.json();

      setCountries(data);
    } catch {
      setError("Failed to load countries");
    } finally {
      setLoadingCountries(false);
    }
  }

  useEffect(() => {
    getCountries();
  }, []);

  return (
    <div className="min-h-screen flex justify-center">
      <div className="my-8 shadow-2xl p-4 w-[30%]">
        <h1 className="text-4xl font-semibold uppercase tracking-widest text-center mt-8 mb-8">
          Public Holidays
        </h1>

        {error && <Error message={error} />}

        {loadingCountries && (
          <div className="w-25 mx-auto my-4">
            <Loader />
          </div>
        )}

        {countries.length > 0 && (
          <div className="flex justify-center mb-8">
            <select
              name="countries"
              className="p-4 border border-gray-300 rounded-md"
            >
              {countries.map((item) => (
                <option key={item.isoCode} value={item.isoCode}>
                  {item.name[0].text}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="px-4">
          <ul className="list-disc flex flex-col gap-2"></ul>
        </div>
      </div>
    </div>
  );
}

export default App;
