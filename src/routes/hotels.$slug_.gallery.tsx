import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { hotels } from "@/data/hotels";
import { getHotelGalleryAlbums } from "@/data/hotel-images";
import { HotelProvider } from "@/context/hotel";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { Reveal } from "@/components/Reveal";
import { pageMeta } from "@/lib/site";

export const Route = createFileRoute("/hotels/$slug_/gallery")({
  loader: ({ params }) => {
    const hotel = hotels.find((entry) => entry.slug === params.slug);
    if (!hotel) throw notFound();
    return {
      hotel,
      albums: getHotelGalleryAlbums(hotel.id),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Gallery unavailable" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.hotel.name} — Photo Gallery`;
    const description = `View all photos of ${loaderData.hotel.name} in ${loaderData.hotel.place}. Suites, dining, exterior and more.`;
    return pageMeta({
      title,
      description,
      path: `/hotels/${loaderData.hotel.slug}/gallery`,
      image: loaderData.hotel.hero,
    });
  },
  component: HotelGalleryPage,
});

function HotelGalleryPage() {
  const { hotel, albums } = Route.useLoaderData();

  return (
    <HotelProvider initialId={hotel.id}>
      <main className="min-h-svh bg-forest text-ivory">
        <Nav />

      <header className="border-b border-ivory/15">
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-5 py-5 sm:px-10">
          <Link
            to="/hotels/$slug"
            params={{ slug: hotel.slug }}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-ivory/30 transition-colors hover:bg-ivory hover:text-forest"
            aria-label={`Back to ${hotel.name}`}
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="eyebrow text-ivory/60">Photo gallery</p>
            <h1 className="font-display text-2xl sm:text-3xl">
              {hotel.name}, {hotel.place}
            </h1>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-10 sm:py-14">
        <div className="rounded-sm bg-ivory px-5 py-8 text-forest sm:px-8 sm:py-10">
          {albums.map((album) => (
            <section key={album.title} className="not-first:mt-14 sm:not-first:mt-16">
              <Reveal>
                <h2 className="font-display text-3xl text-accent sm:text-4xl">{album.title}</h2>
              </Reveal>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-3">
                {album.images.map((image) => (
                  <figure
                    key={`${album.title}-${image.src}`}
                    className="group overflow-hidden bg-secondary"
                  >
                    <img
                      src={image.src}
                      alt={image.caption}
                      loading="lazy"
                      className="aspect-[4/3] h-full w-full object-cover transition-transform duration-[1200ms] ease-luxe group-hover:scale-[1.03]"
                    />
                    <figcaption className="eyebrow px-3 pt-4 pb-3 text-foreground/70 sm:px-4 sm:pt-5 sm:pb-4">
                      {image.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <Footer />
      <WhatsAppFloat />
      </main>
    </HotelProvider>
  );
}
