import { topTracks } from "@/lib/spotify";
import { NextResponse } from "next/server";

export async function GET() {
  const items = await topTracks()

  const tracks = items.map((track) => ({
    title: track.name,
    artist: track.artists.map((artist: any) => artist.name).join(", "),
    url: track.external_urls.spotify,
    coverImage: track.album.images[1],
  }))

  return NextResponse.json(tracks)
}
