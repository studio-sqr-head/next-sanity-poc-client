import Link from "next/link";
import { SanityDocument } from "next-sanity";

import { client } from "@/sanity/client";
import Header from "@/components/header";

const EVENTS_QUERY = `*[_type == "event" && defined(slug.current)]{_id, name, slug, date}|order(date desc)`;

export default async function IndexPage({
  params: { lang },
}: {
  params: {
    lang: string;
    slug: string;
  };
}) {
  const events = await client.fetch<SanityDocument[]>(EVENTS_QUERY);

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
          Events
        </h2>
        <ul className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3 lg:gap-8">
          {events.map((event) => {
            if (!event) return null;

            const name = event?.name?.find(
              (n: { _key: string; value: string }) => n._key === lang
            )?.value;
            return (
              <li
                className="event-card bg-white dark:bg-gray-950 p-4 rounded-lg shadow-md"
                key={event._id}
              >
                <Link
                  className="hover:underline"
                  href={`/${lang}/events/${event.slug.current}`}
                >
                  <h2 className="text-xl font-semibold">
                    {name ?? "Untitled"}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    {new Date(event?.date).toLocaleDateString()}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
}
