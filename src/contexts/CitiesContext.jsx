import {
	// useState,
	useEffect,
	createContext,
	useContext,
	useReducer
} from "react";

import jsonCities from "../../data/cities.json";

const CitiesContext = createContext();
const initialState = {
	cities: [],
	isLoading: false,
	currentCity: {}
}
function reducer(state, action) {
	switch (action.type) {
		case "loading":
			return { ...state, isLoading: true };
		case "cities/loaded":
			return { ...state, cities: action.payload, isLoading: false };
		case "city/loaded":
			return { ...state, currentCity: action.payload, isLoading: false };
		case "city/added":
			return { ...state, currentCity: action.payload, isLoading: false };
		case "city/add-failed":
			// alert(action.payload + "\nCan't make changes offline");
			return {
				...state,
				cities: [...state.cities, action.payload]
				, isLoading: false
			};
		case "city/deleted":
			return { ...state, currentCity: {}, isLoading: false };
		case "city/delete-failed":
			// alert(action.payload + "\nCan't make changes offline");
			return { ...state, cities: state.cities.filter((c) => c.id !== action.payload), isLoading: false };
		default:
			throw new Error("Unknown Action !!");
	}
}


function CitiesProvider({ children }) {
	const [{
		cities,
		// error,
		isLoading,
		currentCity
	}, dispatch] = useReducer(reducer, initialState);
	// const [cities, setCities] = useState([]);
	// const [isLoading, setIsLoading] = useState(false);
	// const [currentCity, setCurrentCity] = useState({});

	const BASE_URL = "http://localhost:8000";

	useEffect(function () {
		// fetching data from the backend,
		// and then set the cities state with the response,
		// and handle errors, and finally loading state.
		async function fetchCities() {
			dispatch({ type: "loading" });
			try {
				const res = await fetch(`${BASE_URL}/cities`);
				const data = await res.json();
				dispatch({ type: "cities/loaded", payload: data });
				// setCities(data);
				// console.log(data);
			} catch (error) {
				// alert("Error fetching cities: " + error.message);
				alert("Error fetching cities: " + error.message + ".\nYou'll be using local data instead.");
				// setCities(jsonCities.cities);
				dispatch({ type: "cities/loaded", payload: jsonCities.cities });
			}
		}
		fetchCities();
	}, []);

	async function getCity(cityId) {
		if (Number(cityId) === currentCity.id) return;
		dispatch({ type: "loading" });
		try {
			const res = await fetch(`${BASE_URL}/cities/${cityId}`);
			const data = await res.json();
			dispatch({ type: "city/loaded", payload: data });
			// console.log('Current city data:', data);
		} catch (error) {
			// alert(
			// 	"Error fetching city: "
			// 	+ error.message
			// 	+ ".\nYou'll be using local data instead."
			// );
			const fallback =
				jsonCities?.cities?.find((c) => (c.id).toString() === cityId);
			dispatch({ type: "city/loaded", payload: fallback });
		}
	}

	async function createCity(newCity) {
		dispatch({ type: "loading" });
		try {
			const res = await fetch(
				`${BASE_URL}/cities`,
				{
					method: 'POST',
					body: JSON.stringify(newCity),
					headers: {
						"Content-Type": "application/json"
					},
				}
			);
			const data = await res.json();
			// console.log(data);
			dispatch({ type: "city/added", payload: data })
		} catch (err) {
			// console.error(err.message)
			dispatch({ type: "city/add-failed", payload: newCity })
		}
	}

	async function deleteCity(cityId) {
		dispatch({ type: "loading" });
		try {
			await fetch(`${BASE_URL}/cities/${cityId}`, { method: 'DELETE' });
			dispatch({ type: "city/deleted" })
		} catch (err) {
			console.error(err.message);
			dispatch({ type: "city/delete-failed", payload: cityId })
		}
	}

	return (
		<CitiesContext.Provider
			value={{
				cities,
				isLoading,
				currentCity,
				getCity,
				createCity,
				deleteCity
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