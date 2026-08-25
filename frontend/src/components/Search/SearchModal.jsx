import { Command , CommandList , CommandInput , CommandEmpty , CommandGroup , CommandItem , CommandSeparator} from "@/components/ui/command";

import { mockSearchData } from "./mockData";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";


const SearchModal = ({open, onOpenChange }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  // Filter the trips based on the query
  const filteredTrips = mockSearchData.popularTrips.filter((trip) =>
    trip.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectSearch = (term) => {
    onOpenChange?.(false);
    navigate(`/user/trips?search=${encodeURIComponent(term)}`);
  };

  const handleSelectDestination = (dest) => {
    onOpenChange?.(false);
    navigate(`/user/trips?location=${encodeURIComponent(dest)}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>  
      <DialogContent className="p-0 overflow-hidden sm:max-w-4xl md:max-w-5xl lg:max-w-6xl w-[94vw]">
        <Command>
          <CommandInput
            placeholder="Search destinations, trips or guides..."
            value={query}
            onValueChange={setQuery}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                handleSelectSearch(query.trim());
              }
            }}
          />          
          <CommandList>
            {query !== "" && (
              <CommandGroup heading="Trips">
                {filteredTrips.map((trip) => (
                  <CommandItem
                    key={trip.id}
                    onSelect={() => handleSelectSearch(trip.title)}
                    className="cursor-pointer"
                  >
                    {trip.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {query === "" && (
              <>
                <CommandGroup heading="🔥 Popular Trips">
                  {mockSearchData.popularTrips.map((trip) => (
                    <CommandItem
                      key={trip.id}
                      onSelect={() => handleSelectSearch(trip.title)}
                      className="cursor-pointer"
                    >
                      {trip.title}
                    </CommandItem>
                  ))}
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="🕘 Recent Searches">
                  {mockSearchData.recentSearches.map((search) => (
                    <CommandItem
                      key={search}
                      onSelect={() => handleSelectSearch(search)}
                      className="cursor-pointer"
                    >
                      {search}
                    </CommandItem>
                  ))}
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="🌍 Trending Destinations">
                  {mockSearchData.trendingDestinations.map((destination) => (
                    <CommandItem
                      key={destination}
                      onSelect={() => handleSelectDestination(destination)}
                      className="cursor-pointer"
                    >
                      {destination}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            <CommandEmpty>No results found for &ldquo;{query}&rdquo;.</CommandEmpty>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;


