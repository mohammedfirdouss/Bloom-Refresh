import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ImpactStats() {
  const stats = [
    {
      title: "Events Completed",
      value: "250+",
      description: "Community cleanup events organized and completed",
    },
    {
      title: "Volunteers",
      value: "12,000+",
      description: "Active volunteers making a difference",
    },
    {
      title: "Waste Collected",
      value: "450 tons",
      description: "Of waste collected and properly disposed",
    },
    {
      title: "Communities",
      value: "50+",
      description: "Communities positively impacted",
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Our Impact
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Together, we're making a real difference
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-green-600">
                  {stat.value}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-semibold">{stat.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 