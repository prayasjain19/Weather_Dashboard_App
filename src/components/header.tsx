import { Link } from "react-router-dom";
// import { CitySearch } from "./city-search";
import { useTheme } from "@/context/theme-provider";
import { ThemeToggle } from "./theme-toggle";
import CityPage from "@/pages/city-page";
import CitySearch from "./city-search";

export function Header() {
    const { theme } = useTheme();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link to={"/"}>
                    <h1 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-black"}`}>
                        Weather Dashboard
                    </h1>
                </Link>

                <div className="flex gap-4">
                    {/* <CitySearch />*/}
                    <CitySearch />
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
export default Header;