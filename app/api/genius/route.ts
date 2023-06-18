import { load } from "cheerio";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET() {
  const browser = await puppeteer.launch({ headless: "new" });

  try {
    const response = await fetch("http://localhost:3000/api/spotify/lyrics");
    const data = await response.json();
    const lyricsUrl = data.lyricsUrl;
    console.log(lyricsUrl);

    const page = await browser.newPage();
    await page.goto(lyricsUrl);
    const html = await page.content();

    const $ = load(html);

    const lyrics = $("[data-lyrics-container=true]");
    $("br", lyrics).replaceWith("\n");
    const scrapedLyrics = lyrics.text();

    return NextResponse.json(scrapedLyrics);
  } catch (error) {
    console.log(error);
  } finally {
    await browser.close();
  }
}
