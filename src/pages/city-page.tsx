import { CurrentWeather } from '@/components/current-weather';
import FavoriteButton from '@/components/favorite-button';
import HourlyTemperature from '@/components/hourly-temperature';
import WeatherSkeleton from '@/components/loading-skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import WeatherDetails from '@/components/weather-details';
import WeatherForecast from '@/components/weather-forecast';
import { useForecastQuery, useWeatherQuery } from '@/hooks/use-weather';
import { AlertTriangle } from 'lucide-react';
import { useParams, useSearchParams } from 'react-router-dom';

//City Page
const CityPage = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");

  const coordinates = { lat, lon };

  //Fetching Data using the React Query
  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);

  //if there is error in fetching
  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load weather data. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data || !params.cityName) {
    return <WeatherSkeleton />;
  }
  return (
    <div className='space-y-4'>
      {/* Favorite List */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {params.cityName}, {weatherQuery.data.sys.country}
        </h1>
        <div className="flex gap-2">
          <FavoriteButton
            data={{ ...weatherQuery.data, name: params.cityName }}
          />
        </div>
      </div>

      {/* Current and Hourly Weather */}
      <div className="grid gap-6">
        <div className="flex flex-col  gap-4">
          {/* Current Weather */}
          <CurrentWeather
            data={weatherQuery.data}
          />
          {/* Hourly Temperature */}
          <HourlyTemperature data={forecastQuery.data} />
        </div>

        <div className="grid gap-6 md:grid-cols-2 items-start">
          {/* Deatils of the Weather */}
          <WeatherDetails data={weatherQuery.data} />
          {/* 5- Day Forecast Data */}
          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div>
  )
}

export default CityPage