import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import type { ForecastData } from "@/api/type";

interface HourlyTemperatureProps {
    data: ForecastData;
}

interface ChartData {
    time: string;
    temp: number;
    feels_like: number;
}

export function HourlyTemperature({ data }: HourlyTemperatureProps) {
    // Get today's forecast data and format for chart

    // Prepare the forecast data for charting (e.g., line chart showing temperature trends)
    const chartData: ChartData[] = data.list
        .slice(0, 8) // ⏱️ Take the first 8 items (each represents 3-hour interval → next 24 hours)
        .map((item:any) => ({
            // 🕒 Format timestamp into 12-hour clock format like "3AM", "6PM"
            time: format(new Date(item.dt * 1000), "ha"),

            // 🌡️ Round temperature to nearest integer 
            temp: Math.round(item.main.temp),

            // 🤒 Round feels-like temperature to nearest integer
            feels_like: Math.round(item.main.feels_like),
        }));


    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>Today's Temperature</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full">
                    {/* Displaying Graph for Todays Temperature */}
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <XAxis
                                dataKey="time"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}°`}
                            />
                            {/* ToolTip , payload contain the actual data */}
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                            Temperature
                                                        </span>
                                                        <span className="font-bold">
                                                            {payload[0].value}°
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                            Feels Like
                                                        </span>
                                                        <span className="font-bold">
                                                            {payload[1].value}°
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="temp"
                                stroke="#2563eb"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="feels_like"
                                stroke="#64748b"
                                strokeWidth={2}
                                dot={false}
                                strokeDasharray="5 5"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

export default HourlyTemperature;