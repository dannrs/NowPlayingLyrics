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
  const artist = song.item.artists
    .map((artist: any) => artist.name.toLowerCase())
    .join(', ')
  const title = song.item.name.toLowerCase()

  // Get Lyrics Url
  const response = await getLyricsURL()
  const lyrics = await response.json()
  const hits = lyrics.response.hits
  let lyricsUrlRo = ''
  let lyricsUrlKo = ''
  let lyricsUrlEn = ''
  let lyricsUrlJa = ''

  for (const hit of hits) {
    let lang = hit.result.language
    let url = hit.result.url
    let hitArtist = hit.result.primary_artist.name.toLowerCase()

    if (url.includes('romanized') || url.includes('romanizations')) {
      lyricsUrlRo = hit.result.url
    } else if (hitArtist.includes(artist) && lang === 'ko') {
      lyricsUrlKo = hit.result.url
    } else if (hit.result.url.includes('english') && lang === 'en') {
      lyricsUrlEn = hit.result.url
    } else if (hitArtist.includes(artist) && lang === 'ja') {
      lyricsUrlJa = hit.result.url
    }
  }

  return NextResponse.json({
    revalidated: true,
    artist,
    title,
    lyricsUrlRo,
    lyricsUrlKo,
    lyricsUrlEn,
    lyricsUrlJa
  })
}
