import { topArtists } from "@/lib/spotify";
import { NextResponse } from "next/server";

export async function GET() {
  const items = await topArtists()

  const artists = items.map((artist) => ({
    id: artist.id,
    name: artist.name,
    url: artist.external_urls.spotify,
    popularity: artist.popularity,
    coverImage: artist.images ? artist.images[1] : null
  }))

  return NextResponse.json(artists)
}
