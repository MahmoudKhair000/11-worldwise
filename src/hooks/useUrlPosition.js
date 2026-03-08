import { useSearchParams } from "react-router-dom";

export default function useUrlPosition(defaultValue = [0, 0]) {
  const [searchParams] = useSearchParams();
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  return [
    lat ? parseFloat(lat) : defaultValue[0],
    lng ? parseFloat(lng) : defaultValue[1]
  ];
}
