import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./use-local-storage";

// 🔹 Interface for each item in the search history
interface SearchHistoryItem {
  id: string;
  query: string;
  lat: number;
  lon: number;
  name: string;
  country: string;
  state?: string;
  searchedAt: number; // timestamp of when the search was made
}

// 🔍 Custom hook for managing search history using React Query and LocalStorage
export function useSearchHistory() {
  // 📦 Local storage hook to persist search history across sessions
  const [history, setHistory] = useLocalStorage<SearchHistoryItem[]>(
    "search-history",
    []
  );

  // 🧠 React Query client for managing cache
  const queryClient = useQueryClient();

  // 📥 Query to retrieve search history from local storage (cached by React Query)
  const historyQuery = useQuery({
    queryKey: ["search-history"],
    queryFn: () => history,
    initialData: history,
  });

  // ➕ Mutation to add a new search to history
  const addToHistory = useMutation({
    // 🎯 Accepts search input (excluding id & timestamp)
    mutationFn: async (
      search: Omit<SearchHistoryItem, "id" | "searchedAt">
    ) => {
      // Generate new search item with ID and timestamp
      const newSearch: SearchHistoryItem = {
        ...search,
        id: `${search.lat}-${search.lon}-${Date.now()}`,
        searchedAt: Date.now(),
      };

      // 🚫 Remove duplicates (same lat/lon) and keep only latest 10
      const filteredHistory = history.filter(
        (item) => !(item.lat === search.lat && item.lon === search.lon)
      );
      const newHistory = [newSearch, ...filteredHistory].slice(0, 10);

      // 💾 Save updated history to local storage
      setHistory(newHistory);
      return newHistory;
    },

    // ✅ On success, update query cache so UI reflects change immediately
    onSuccess: (newHistory) => {
      queryClient.setQueryData(["search-history"], newHistory);
    },
  });

  // 🗑 Mutation to clear the entire search history
  const clearHistory = useMutation({
    mutationFn: async () => {
      setHistory([]); // clear from local storage
      return [];
    },
    onSuccess: () => {
      queryClient.setQueryData(["search-history"], []); // clear cache
    },
  });

  return {
    history: historyQuery.data ?? [], // fallback to empty array
    addToHistory, // mutation object with .mutate() method
    clearHistory, // mutation object with .mutate() method
  };
}
