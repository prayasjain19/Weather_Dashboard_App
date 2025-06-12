// Favorite Cities UI component for displaying weather cards of saved locations

import { useNavigate } from "react-router-dom";
import { useWeatherQuery } from "@/hooks/use-weather"; // Custom hook for fetching weather data
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { X, Loader2 } from "lucide-react"; // Icons
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // For toast notifications
import { useFavorites } from "@/hooks/use-favourite"; // Custom hook for favorite cities

// Props for the individual favorite city card
interface FavoriteCityTabletProps {
  id: string;
  name: string;
  lat: number;
  lon: number;
  onRemove: (id: string) => void;
}

// Renders a single favorite city with current weather info
function FavoriteCityTablet({
  id,
  name,
  lat,
  lon,
  onRemove,
}: FavoriteCityTabletProps) {
  const navigate = useNavigate();

  // Fetch current weather data for this city
  const { data: weather, isLoading } = useWeatherQuery({ lat, lon });

  // Redirect to city details page on click
  const handleClick = () => {
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
  };

  return (
    <div
      onClick={handleClick}
      className="relative flex min-w-[250px] cursor-pointer items-center gap-3 rounded-lg border bg-card p-4 pr-8 shadow-sm transition-all hover:shadow-md"
      role="button"
      tabIndex={0}
    >
      {/* ❌ Remove city button (top-right corner) */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1 h-6 w-6 rounded-full p-0 hover:text-destructive-foreground"
        onClick={(e) => {
          e.stopPropagation(); // Prevent click from triggering navigation
          onRemove(id); // Call parent callback to remove from favorites
          toast.error(`Removed ${name} from Favorites`);
        }}
      >
        <X className="h-4 w-4" />
      </Button>

      {/* ⏳ Loading spinner */}
      {isLoading ? (
        <div className="flex h-8 items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : weather ? (
        <>
          {/* 🌤️ Weather icon, city and country name */}
          <div className="flex items-center gap-2">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
              alt={weather.weather[0].description}
              className="h-8 w-8"
            />
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-xs text-muted-foreground">
                {weather.sys.country}
              </p>
            </div>
          </div>

          {/* 🌡️ Temperature and weather description */}
          <div className="ml-auto text-right">
            <p className="text-xl font-bold">
              {Math.round(weather.main.temp)}°
            </p>
            <p className="text-xs capitalize text-muted-foreground">
              {weather.weather[0].description}
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}

// 🧩 Parent component to render a scrollable list of all favorite cities
export function FavoriteCities() {
  const { favorites, removeFavorite } = useFavorites();

  // If there are no favorites, return nothing
  if (!favorites.length) {
    return null;
  }

  return (
    <>
      <h1 className="text-xl font-bold tracking-tight">Favorites</h1>
      <ScrollArea className="w-full pb-4">
        <div className="flex gap-4">
          {/* Render each favorite city as a card */}
          {favorites.map((city) => (
            <FavoriteCityTablet
              key={city.id}
              {...city}
              onRemove={() => removeFavorite.mutate(city.id)}
            />
          ))}
        </div>

        {/* Scrollbar for horizontal overflow */}
        <ScrollBar orientation="horizontal" className="mt-2" />
      </ScrollArea>
    </>
  );
}
