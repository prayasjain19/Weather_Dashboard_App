import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from './ui/button';
import { Clock, Loader2, Search, Star, XCircle } from 'lucide-react';
import { useLocationSearch } from '@/hooks/use-weather';
import { useSearchHistory } from '@/hooks/use-search-history';
import { format } from 'date-fns';
import { useFavorites } from '@/hooks/use-favourite';
const CitySearch = () => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    const { data: locations, isLoading } = useLocationSearch(query);
     const { history, clearHistory, addToHistory } = useSearchHistory();
     const {favorites} = useFavorites();

    const handleSelect = (cityData: string) => {
    const [lat, lon, name, country] = cityData.split("|");

    // Add to search history
    addToHistory.mutate({
      query,
      name,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      country,
    });

    setOpen(false);
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
  };
    return (
        <>
            <Button
                variant="outline"
                className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
                onClick={() => setOpen(true)}
            >
                <Search className="mr-2 h-4 w-4" />
                Search cities...
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <Command>
                    <CommandInput
                        placeholder="Search cities..."
                        value={query}
                        onValueChange={setQuery}
                    />
                    <CommandList>
                        {query.length > 2 && !isLoading && (
                            <CommandEmpty>No cities found.</CommandEmpty>
                        )}

                        {/* Favorites Section */}
                        {favorites.length > 0 && (
                            <CommandGroup heading="Favorites">
                                {favorites.map((city) => (
                                    <CommandItem
                                        key={city.id}
                                        value={`${city.lat}|${city.lon}|${city.name}|${city.country}`}
                                        onSelect={handleSelect}
                                    >
                                        <Star className="mr-2 h-4 w-4 text-yellow-500" />
                                        <span>{city.name}</span>
                                        {city.state && (
                                            <span className="text-sm text-muted-foreground">
                                                , {city.state}
                                            </span>
                                        )}
                                        <span className="text-sm text-muted-foreground">
                                            , {city.country}
                                        </span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}

                        {/* Search History Section */}
                        {history.length > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <div className="flex items-center justify-between px-2 my-2">
                                        <p className="text-xs text-muted-foreground">
                                            Recent Searches
                                        </p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => clearHistory.mutate()}
                                        >
                                            <XCircle className="h-4 w-4" />
                                            Clear
                                        </Button>
                                    </div>
                                    {history.map((location) => (
                                        <CommandItem
                                            key={location.id}
                                            value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                                            onSelect={handleSelect}
                                        >
                                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <span>{location.name}</span>
                                            {location.state && (
                                                <span className="text-sm text-muted-foreground">
                                                    , {location.state}
                                                </span>
                                            )}
                                            <span className="text-sm text-muted-foreground">
                                                , {location.country}
                                            </span>
                                            <span className="ml-auto text-xs text-muted-foreground">
                                                {format(location.searchedAt, "MMM d, h:mm a")}
                                            </span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </>
                        )}

                        {/* Search Results */}
                        <CommandSeparator />
                        {locations && locations.length > 0 && (
                            <CommandGroup heading="Suggestions">
                                {isLoading && (
                                    <div className="flex items-center justify-center p-4">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    </div>
                                )}
                                {locations?.map((location) => (
                                    <CommandItem
                                        key={`${location.lat}-${location.lon}`}
                                        value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                                        onSelect={handleSelect}
                                    >
                                        <Search className="mr-2 h-4 w-4" />
                                        <span>{location.name}</span>
                                        {location.state && (
                                            <span className="text-sm text-muted-foreground">
                                                , {location.state}
                                            </span>
                                        )}
                                        <span className="text-sm text-muted-foreground">
                                            , {location.country}
                                        </span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </CommandDialog>
        </>

    )
}

export default CitySearch