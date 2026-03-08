// React imports
// import { useEffect, useState } from "react";
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
import { CitiesProvider } from "./contexts/CitiesContext";
import { AuthProvider } from "./contexts/FakeAuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";

// import PageNav from "./components/PageNav";

function App() {


  return (
    <CitiesProvider>
      <BrowserRouter>
        <AuthProvider>
          {/* NavLink component should be in BrowserRouter,
        because it needs to access the router context,
        without it won't be recognized and won't work */}
          {/* <PageNav /> */}
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/product" element={<Product />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/app/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate replace to="cities" />} />
              {/* you render the element in the UI by using the component <Outlet/> */}
              <Route path="cities" element={<CityList />} />
              <Route path="cities/:id" element={<City />} />
              <Route path="countries" element={<CountryList />} />
              <Route path="form" element={<Form />} />
            </Route>
            {/* means all other routes will go to PageNotFound */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </CitiesProvider>
  );
}

export default App;
