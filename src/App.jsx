import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Pricing from "./pages/Pricing";
import Product from "./pages/Product";
import AppLayout from "./pages/AppLayout";
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";

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
        console.log(data);
      } catch (error) {
        alert("Error fetching cities: " + error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCities();
  }, []);

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
        <Route path="/app" element={<AppLayout />}>
          <Route
            index
            element={<CityList isLoading={isLoading} cities={cities} />}
          />
          {/* you render the element in the UI by using the component <Outlet/> */}
          <Route
            path="/app/cities"
            element={<CityList isLoading={isLoading} cities={cities} />}
          />
          <Route path="/app/cities/:id" element={<City cities={cities} />} />
          <Route
            path="countries"
            element={<CountryList isLoading={isLoading} cities={cities} />}
          />
          <Route path="form" element={<p>form to add</p>} />
        </Route>
        {/* <Route path="*" element={<PageNotFound />} />
        // means all other routes will go to PageNotFound */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
