/* eslint-disable react/prop-types */
import {
	useState,
	useEffect,
	createContext,
	useContext
} from "react";

import jsonCities from "../../data/cities.json";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
	const [cities, setCities] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [currentCity, setCurrentCity] = useState({});

	const BASE_URL = "http://localhost:8000";

	useEffect(function () {
		// fetching data from the backend,
		// and then set the cities state with the response,
		// and handle errors, and finally loading state.
		async function fetchCities() {
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

	async function getCity(id) {
		try {
			setIsLoading(true);
			const res = await fetch(`${BASE_URL}/cities/${id}`);
			const data = await res.json();
			setCurrentCity(data);
			console.log('Current city data:', data);
		} catch (error) {
			alert(
				"Error fetching city: "
				+ error.message
				+ ".\nYou'll be using local data instead."
			);
			const fallback =
				jsonCities.cities
					.find((c) => (c.id).toString() === id);
			setCurrentCity(fallback);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<CitiesContext.Provider
			value={{
				cities,
				isLoading,
				currentCity,
				getCity
			}}
		> {children}
		</CitiesContext.Provider>
	);
}

function useCitiesContext() {
	const citiesContext = useContext(CitiesContext);
	if (citiesContext === undefined)
		throw new Error('Context was used outside of its Provider');
	return citiesContext;
}

// eslint-disable-next-line react-refresh/only-export-components
export { CitiesProvider, useCitiesContext };