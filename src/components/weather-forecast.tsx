import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";
import { format } from "date-fns";
import type { ForecastData } from "@/api/type";

interface WeatherForecastProps {
    data: ForecastData;
}

// Define the structure for daily forecast data
interface DailyForecast {
    date: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    wind: number;
    weather: {
        id: number;
        main: string;
        description: string;
        icon: string;
    };
}

export function WeatherForecast({ data }: WeatherForecastProps) {

    // 📅 Group forecast data by day and extract min/max temperature, wind, and weather
    const dailyForecasts = data.list.reduce((acc, forecast) => {
        const date = format(new Date(forecast.dt * 1000), "yyyy-MM-dd");

        if (!acc[date]) {
            // If day not yet added, initialize it
            acc[date] = {
                temp_min: forecast.main.temp_min,
                temp_max: forecast.main.temp_max,
                humidity: forecast.main.humidity,
                wind: forecast.wind.speed,
                weather: forecast.weather[0],
                date: forecast.dt,
            };
        } else {
            // If already exists, update min/max temperatures
            acc[date].temp_min = Math.min(acc[date].temp_min, forecast.main.temp_min);
            acc[date].temp_max = Math.max(acc[date].temp_max, forecast.main.temp_max);
        }

        return acc;
    }, {} as Record<string, DailyForecast>);

    // 🌤 Get forecast for the next 5 days (excluding today)
    const nextDays = Object.values(dailyForecasts).slice(0, 5);

    // 🌡️ Format temperature with degree symbol
    const formatTemp = (temp: number) => `${Math.round(temp)}°`;

    return (
        <Card>
            <CardHeader>
                <CardTitle>5-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {nextDays.map((day) => (
                        <div
                            key={day.date}
                            className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-lg border p-4"
                        >
                            {/* Date & Description */}
                            <div className="flex flex-col justify-center items-start gap-1">
                                <p className="font-medium">
                                    {format(new Date(day.date * 1000), "EEE, MMM d")}
                                </p>
                                <p className="text-sm text-muted-foreground capitalize">
                                    {day.weather.description}
                                </p>
                            </div>

                            {/* Min/Max Temp */}
                            <div className="flex justify-start sm:justify-center gap-4">
                                <span className="flex items-center text-blue-500">
                                    <ArrowDown className="mr-1 h-4 w-4" />
                                    {formatTemp(day.temp_min)}
                                </span>
                                <span className="flex items-center text-red-500">
                                    <ArrowUp className="mr-1 h-4 w-4" />
                                    {formatTemp(day.temp_max)}
                                </span>
                            </div>

                            {/* Humidity & Wind */}
                            <div className="flex justify-start sm:justify-end gap-4">
                                <span className="flex items-center gap-1">
                                    <Droplets className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm">{day.humidity}%</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <Wind className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm">{day.wind}m/s</span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
export default WeatherForecast