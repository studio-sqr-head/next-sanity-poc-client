import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { client } from "@/sanity/client";
import Header from "@/components/header";

// lang specific query
const EVENT_QUERY = `*[_type == "event" && slug.current == $slug][0]{
  _id,
  name,
  date,
  headline,
  image,
  details,
  eventType,
  doorsOpen,
  venue,
  tickets
}`;
const { projectId, dataset } = client.config();
export const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

export default async function EventPage({
  params: { lang, slug },
  ...rest
}: {
  params: {
    lang: string;
    slug: string;
  };
}) {
  const event = await client.fetch<SanityDocument>(EVENT_QUERY, { slug });

  const {
    name,
    date,
    headline,
    image,
    details,
    eventType,
    doorsOpen,
    venue,
    tickets,
  } = event || {};
  const eventImageUrl = image ? urlFor(image)?.url() : null;
  const artistImageUrl = headline?.photo
    ? urlFor(headline?.photo)?.url()
    : null;
  const eventDate = new Date(date).toDateString();
  const eventTime = new Date(date).toLocaleTimeString();
  const doorsOpenTime = new Date(
    new Date(date).getTime() + doorsOpen * 60000
  ).toLocaleTimeString();
  const displayImage = eventImageUrl || artistImageUrl;

  return (
    <>
      <Header />
      <main className="w-full min-h-screen py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="mb-4">
            <Link href={`/${lang}`}>← Back to Events</Link>
          </div>
          <div className="grid items-top gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
            {displayImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt="Image"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                height="310"
                src={displayImage}
                width="550"
              />
            )}
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                {eventType && (
                  <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800 capitalize">
                    {eventType.replace("-", " ")}
                  </div>
                )}
                {name != null && (
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    {name?.find((n: { _key: string }) => n._key === lang)
                      ?.value || "Untitled"}
                  </h1>
                )}
                {headline?.name && (
                  <dl className="grid grid-cols-2 gap-1 text-sm font-medium sm:gap-2 lg:text-base">
                    <div className="flex items-start">
                      <dt className="sr-only">Artist</dt>
                      <dd className="font-semibold">Artist</dd>
                    </div>
                    <div className="grid gap-1">
                      <dt>{headline?.name}</dt>
                    </div>
                  </dl>
                )}
                <dl className="grid grid-cols-2 gap-1 text-sm font-medium sm:gap-2 lg:text-base">
                  <div className="flex items-start">
                    <dt className="sr-only">Date</dt>
                    <dd className="font-semibold">Date</dd>
                  </div>
                  <div className="grid gap-1">
                    {eventDate && <dt>{eventDate}</dt>}
                    {eventTime && <dt>{eventTime}</dt>}
                  </div>
                </dl>
                {doorsOpenTime && (
                  <dl className="grid grid-cols-2 gap-1 text-sm font-medium sm:gap-2 lg:text-base">
                    <div className="flex items-start">
                      <dt className="sr-only">Doors Open</dt>
                      <dd className="font-semibold">Doors Open</dd>
                    </div>
                    <div className="grid gap-1">
                      <dt>Doors Open</dt>
                      <dt>{doorsOpenTime}</dt>
                    </div>
                  </dl>
                )}
                <dl className="grid grid-cols-2 gap-1 text-sm font-medium sm:gap-2 lg:text-base">
                  <div className="flex items-start">
                    <dt className="sr-only">Venue</dt>
                    <dd className="font-semibold">Venue</dd>
                  </div>
                  <div className="grid gap-1">
                    <dt>{venue?.name}</dt>
                    <dt>
                      {venue?.city}, {venue?.country}
                    </dt>
                  </div>
                </dl>
              </div>
              {details && details.length > 0 && (
                <div className="prose max-w-none">
                  <PortableText value={details} />
                </div>
              )}
              {tickets && (
                <div className="flex gap-4">
                  <a
                    className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 w-1/2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                    href={tickets}
                  >
                    Buy Tickets
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
