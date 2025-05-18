import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HowItWorks() {
  const steps = [
    {
      title: "Find Events",
      description: "Browse through local cleanup events in your area and find one that interests you.",
      icon: "🔍",
    },
    {
      title: "Sign Up",
      description: "Create an account and register for the event you want to join.",
      icon: "✍️",
    },
    {
      title: "Join & Contribute",
      description: "Show up at the event location and help make a difference in your community.",
      icon: "🤝",
    },
    {
      title: "Track Impact",
      description: "Monitor your contribution and see the impact you're making in your community.",
      icon: "📊",
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Get started in four simple steps
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {steps.map((step, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="text-4xl mb-4">{step.icon}</div>
                <CardTitle>{step.title}</CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Step {index + 1}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 