import { getLyricsURL } from '@/lib/genius'
import { NextRequest, NextResponse } from 'next/server'
import { load } from 'cheerio'
import puppeteer from 'puppeteer'
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

  let browser
  try {
    browser = await puppeteer.launch({ headless: 'new' })
    const page = await browser.newPage()
    await page.goto(lyricsUrl)
    const html = await page.content()

    const $ = load(html)

    const lyrics = $('[data-lyrics-container=true]')
    $('br', lyrics).replaceWith('\n')
    const scrapedLyrics = lyrics.text()

    return NextResponse.json({ revalidated: true, scrapedLyrics })
  } catch (error) {
    console.log(error)
  } finally {
    await browser?.close()
  }
}