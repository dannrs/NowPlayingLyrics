import { getLyricsURL } from '@/lib/genius'
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'


export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path') || '/'
  revalidatePath(path)

  const response = await getLyricsURL()
  const lyrics = await response.json()

  const hits = lyrics.response.hits
  let lyricsUrl = ''

  for (const hit of hits) {
    if (hit.result.language === 'romanization') {
      lyricsUrl = hit.result.url
      break
    } else if (
      hit.result.language === 'ko' ||
      hit.result.language === 'en' ||
      hit.result.language === 'ja'
    ) {
      if (!lyricsUrl) {
        lyricsUrl = hit.result.url
      }
    }
  }

  return NextResponse.json({revalidated: true, lyricsUrl})
}
