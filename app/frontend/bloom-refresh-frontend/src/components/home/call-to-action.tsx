import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CallToAction() {
  const router = useRouter();

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-green-600">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
              Ready to Make a Difference?
            </h2>
            <p className="mx-auto max-w-[700px] text-green-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join our community of volunteers and help make your neighborhood a better place.
            </p>
          </div>
          <div className="space-x-4">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => router.push('/events')}
            >
              Find Events
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white hover:text-green-600"
              onClick={() => router.push('/auth/signup')}
            >
              Sign Up Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
} 