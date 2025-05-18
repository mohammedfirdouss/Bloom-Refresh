import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function FeaturedEvents() {
  const router = useRouter();
  const events = [
    {
      id: 1,
      title: "Beach Cleanup",
      date: "2024-03-15",
      location: "Santa Monica Beach",
      description: "Join us for a beach cleanup event to help keep our shores clean.",
      spots: 25,
    },
    {
      id: 2,
      title: "Park Restoration",
      date: "2024-03-20",
      location: "Central Park",
      description: "Help restore our local park by planting trees and cleaning up litter.",
      spots: 15,
    },
    {
      id: 3,
      title: "River Cleanup",
      date: "2024-03-25",
      location: "River Walk",
      description: "Clean up the river banks and help maintain our water ecosystem.",
      spots: 20,
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Featured Events
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Join our upcoming community cleanup events
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {events.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>{event.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {event.description}
                </p>
                <div className="mt-4">
                  <p className="text-sm font-medium">Date: {event.date}</p>
                  <p className="text-sm font-medium">Available Spots: {event.spots}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => router.push(`/events/${event.id}`)}
                >
                  Join Event
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 