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
    .map((artist: any) => artist.name)
    .join(', ')
    .toLowerCase()
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
    if (
      hit.result.full_title.toLowerCase().includes(`${artist}`) &&
      hit.result.full_title.toLowerCase().includes(`${title}`) &&
      (hit.result.full_title.toLowerCase().includes('romanized') ||
        hit.result.language === 'romanization')
    ) {
      lyricsUrlRo = hit.result.url
    } else if (
      hit.result.full_title.toLowerCase().includes(`${artist}`) &&
      hit.result.full_title.toLowerCase().includes(`${title}`) &&
      hit.result.language === 'ko'
    ) {
      lyricsUrlKo = hit.result.url
    } else if (
      hit.result.full_title.toLowerCase().includes(`${artist}`) &&
      hit.result.full_title.toLowerCase().includes(`${title}`) &&
      hit.result.language === 'en'
    ) {
      lyricsUrlEn = hit.result.url
    } else if (
      hit.result.full_title.toLowerCase().includes(`${artist}`) &&
      hit.result.full_title.toLowerCase().includes(`${title}`) &&
      hit.result.language === 'ja'
    ) {
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
