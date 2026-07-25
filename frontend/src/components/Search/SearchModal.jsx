import { Command , CommandList , CommandInput , CommandEmpty , CommandGroup , CommandItem , CommandSeparator} from "@/components/ui/command";

import { mockSearchData } from "./mockData";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";


const SearchModal = ({open, onOpenChange }) => {

const [query, setQuery] = useState("");

// Filter the trips based on the query
const filteredTrips = mockSearchData.popularTrips.filter((trip) =>
  trip.title.toLowerCase().includes(query.toLowerCase())
);
   

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>  
            <DialogContent className="p-0 overflow-hidden">

        <Command>
            <CommandInput
            placeholder="Search destinations, trips or guides..."
            value={query}
            onValueChange={setQuery}
            />          
              <CommandList>
                {query !== "" && (
                    <CommandGroup heading="Trips">
                        {filteredTrips.map((trip) => (
                        <CommandItem key={trip.id}>
                            {trip.title}
                        </CommandItem>
                        ))}
                    </CommandGroup>
                    )}




                {query === "" && (
                <>
                    <CommandGroup heading="🔥 Popular Trips">
                    {mockSearchData.popularTrips.map((trip) => (
                        <CommandItem key={trip.id}>
                        {trip.title}
                        </CommandItem>
                    ))}
                    </CommandGroup>

                    <CommandSeparator />

                    <CommandGroup heading="🕘 Recent Searches">
                    {mockSearchData.recentSearches.map((search) => (
                        <CommandItem key={search}>
                        {search}
                        </CommandItem>
                    ))}
                    </CommandGroup>

                    <CommandSeparator />

                    <CommandGroup heading="🌍 Trending Destinations">
                    {mockSearchData.trendingDestinations.map((destination) => (
                        <CommandItem key={destination}>
                        {destination}
                        </CommandItem>
                    ))}
                    </CommandGroup>
                </>
                )}



                {/* <CommandEmpty>No results found.</CommandEmpty> */}
            </CommandList>
        </Command>


        </DialogContent>
        </Dialog>
    );
}

export default SearchModal;

