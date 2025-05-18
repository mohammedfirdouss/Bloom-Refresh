import EventsMap from '@/components/events/events-map';
import EventsList from '@/components/events/events-list';
import EventsFilter from '@/components/events/events-filter';

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Find Cleanup Events</h1>
          <p className="text-muted-foreground max-w-2xl">
            Discover and join cleanup events in your area. Filter by location, date, or event type to find the perfect opportunity to make a difference.
          </p>
        </div>
        
        <EventsFilter />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <EventsMap />
          </div>
          <div>
            <EventsList />
          </div>
        </div>
      </div>
    </div>
  );
}