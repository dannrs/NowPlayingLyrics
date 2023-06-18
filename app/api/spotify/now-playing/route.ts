import { currentlyPlaying } from '@/lib/spotify'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path') || '/'
  revalidatePath(path)
  const response = await currentlyPlaying()

  if (response.status === 204 || response.status > 400) {
    return NextResponse.json({ isPlaying: false })
  }

  const song = await response.json()

  if (song.item === null) {
    return NextResponse.json({ isPlaying: false })
  }

  const isPlaying = song.is_playing
  const title = song.item.name
  const artist = song.item.artists.map((artist: any) => artist.name).join(', ')
  const album = song.item.album.name
  const albumImageUrl = song.item.album.images[0].url
  const songUrl = song.item.external_urls.spotify

  return NextResponse.json({
    revalidated: true,
    album,
    albumImageUrl,
    artist,
    isPlaying,
    songUrl,
    title
  })
}
