"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, Filter, Search } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from '@/lib/utils';

export default function EventsFilter() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  
  return (
    <div className="bg-card p-4 rounded-lg border">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search by location or event name" 
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "justify-start text-left font-normal w-full sm:w-[200px]",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Select>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="beach">Beach Cleanup</SelectItem>
              <SelectItem value="park">Park Cleanup</SelectItem>
              <SelectItem value="river">River Cleanup</SelectItem>
              <SelectItem value="trail">Trail Maintenance</SelectItem>
              <SelectItem value="city">City Cleanup</SelectItem>
            </SelectContent>
          </Select>
          
          <Button className="flex gap-2 bg-green-500 hover:bg-green-600 text-white">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>
    </div>
  );
}