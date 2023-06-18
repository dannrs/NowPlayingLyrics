import { currentlyPlayed } from '@/lib/spotify'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path') || '/'
  revalidatePath(path)
  const response = await currentlyPlayed()

  const song = await response.json()

  const title = song.items[0].track.name
  const artist = song.items[0].track.artists[0].name
  const albumImageUrl = song.items[0].track.album.images[0].url
  const songUrl = song.items[0].track.external_urls.spotify

  return NextResponse.json({
    revalidated: true,
    title,
    artist,
    albumImageUrl,
    songUrl
  })
}
