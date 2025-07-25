import Image from "next/image";

export function TrustedBy() {
  const logos = [
    { name: "Coursera", src: "/logos/coursera2.webp" },
    { name: "Udemy", src: "/logos/udemy.webp" },
    { name: "edX", src: "/logos/edx.png" },
    { name: "Skillshare", src: "/logos/skillshare.png" },
    { name: "Datacamp", src: "/logos/datacamp.png" },
    { name: "pluralsight", src: "/logos/pluralsight.webp" },
  ];

  return (
    <section className="py-16 w-full">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-muted-foreground mb-8">
          Get best courses from the best platforms
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-16 gap-y-8 justify-items-center items-center">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="relative h-8 w-28 grayscale opacity-50 hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                height={32}
                width={112}
                className="h-full w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
