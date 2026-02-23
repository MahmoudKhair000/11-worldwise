// React imports
import { useEffect, useState } from "react";
// 3rd party libraries imports
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// Pages
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Pricing from "./pages/Pricing";
import Product from "./pages/Product";
import AppLayout from "./pages/AppLayout";
// Components
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";

import jsonCities from "../data/cities.json";
// import PageNav from "./components/PageNav";

function App() {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const BASE_URL = "http://localhost:8000";

  useEffect(function () {
    async function fetchCities() {
      // fetching data from the backend,
      // and then set the cities state with the response.
      setIsLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        setCities(data);
        // console.log(data);
      } catch (error) {
        // alert("Error fetching cities: " + error.message);
        alert("Error fetching cities: " + error.message + ".\nYou'll be using local data instead.");
        setCities(jsonCities.cities);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCities();
  }, []);

  console.log(cities);

  return (
    <BrowserRouter>
      {/* NavLink component should be in BrowserRouter,
       because it needs to access the router context,
       without it won't be recognized and won't work */}
      {/* <PageNav /> */}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/product" element={<Product />} />
        <Route path="/app/" element={<AppLayout />}>
          <Route
            index
            // element={<CityList isLoading={isLoading} cities={cities} />}
            element={<Navigate replace to="cities" />}
          />
          {/* you render the element in the UI by using the component <Outlet/> */}
          <Route
            path="cities"
            element={<CityList isLoading={isLoading} cities={cities} />}
          />
          <Route path="cities/:id" element={<City cities={cities} />} />
          <Route
            path="countries"
            element={<CountryList isLoading={isLoading} cities={cities} />}
          />
          <Route path="form" element={<Form />} />
        </Route>
        {/* <Route path="*" element={<PageNotFound />} />
        // means all other routes will go to PageNotFound */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
