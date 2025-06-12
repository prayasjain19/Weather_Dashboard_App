import { API_CONFIG } from "./config";
import { Coordinates, ForecastData, GeocodingResponse, WeatherData } from "./type";
class WeatherAPI {

    //these private methods are only accessible inside the class making it more secure
    // Constructs a complete API URL with query parameters
    // `endpoint`: API endpoint path (e.g., /weather, /forecast)
    // `params`: Object containing key-value pairs for query parameters
    private createUrl(endpoint: string, params: Record<string, string | number>) {
        const searchParams = new URLSearchParams({
            appid: API_CONFIG.API_KEY,
            ...params,
        });
        // Returns full URL string with parameters
        return `${endpoint}?${searchParams.toString()}`;
    }

    // Helper Method: fetchData<T>()
    // <T> means we dont know the type, it will be dynamic
    private async fetchData<T>(url: string): Promise<T> {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Weather API Error: ${response.statusText}`);
        }

        return response.json();
    }

    // Fetches current weather data for a specific latitude and longitude
    async getCurrentWeather({ lat, lon }: Coordinates): Promise<WeatherData> {
        //To get current weather we use createurl method
        const url = this.createUrl(`${API_CONFIG.BASE_URL}/weather`, {
            lat: lat.toString(),
            lon: lon.toString(),
            units: API_CONFIG.DEFAULT_PARAMS.units,
        });
        // we have used <T> Dynamic type in the method thats why we need to pass the Type
        return this.fetchData<WeatherData>(url);
    }

    // Fetches 5-day weather forecast data for the given coordinates
    async getForecast({ lat, lon }: Coordinates): Promise<ForecastData> {
        const url = this.createUrl(`${API_CONFIG.BASE_URL}/forecast`, {
            lat: lat.toString(),
            lon: lon.toString(),
            units: API_CONFIG.DEFAULT_PARAMS.units,
        });
        return this.fetchData<ForecastData>(url);
    }

    // Converts geographic coordinates to a human-readable location (e.g., city name)
    async reverseGeocode({
        lat,
        lon,
    }: Coordinates): Promise<GeocodingResponse[]> {
        const url = this.createUrl(`${API_CONFIG.GEO}/reverse`, {
            lat: lat.toString(),
            lon: lon.toString(),
            limit: "1",
        });
        return this.fetchData<GeocodingResponse[]>(url);
    }
    async searchLocations(query: string): Promise<GeocodingResponse[]> {
        const url = this.createUrl(`${API_CONFIG.GEO}/direct`, {
            q: query,
            limit: "5",
        });
        return this.fetchData<GeocodingResponse[]>(url);
    }
}

export const weatherAPI = new WeatherAPI();