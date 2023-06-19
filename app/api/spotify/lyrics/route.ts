import { getLyricsURL } from '@/lib/genius'
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { currentlyPlaying } from '@/lib/spotify'

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path') || '/'
  revalidatePath(path)

  // Get artist from currently playing song
  const playing = await currentlyPlaying()
  const song = await playing.json()
  const artist = song.item.artists.map((artist: any) => artist.name).join(', ').toLowerCase()
  // const title = song.item.name

  // Get Lyrics Url
  const response = await getLyricsURL()
  const lyrics = await response.json()
  const hits = lyrics.response.hits
  let lyricsUrl = ''

  for (const hit of hits) {
    if (hit.result.full_title.includes('romanized') || hit.result.language === 'romanization') {
      lyricsUrl = hit.result.url
      break
    } else if (
      (hit.result.artist_names.toLowerCase() === artist &&
        (hit.result.language === 'ko') ||
      hit.result.language === 'en' ||
      hit.result.language === 'ja')
    ) {
      if (!lyricsUrl) {
        lyricsUrl = hit.result.url
      }
      }
  }

  return NextResponse.json({ revalidated: true, lyricsUrl })
}
