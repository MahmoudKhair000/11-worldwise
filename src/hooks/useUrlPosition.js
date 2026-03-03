import { useSearchParams } from "react-router-dom";

function useUrlPosition(defaultValue = [0, 0]) {
  const [searchParams] = useSearchParams();
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  return [
    lat ? parseFloat(lat) : defaultValue[0],
    lng ? parseFloat(lng) : defaultValue[1]
  ];
}

export { useUrlPosition };