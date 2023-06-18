import { currentlyPlaying } from './spotify'

const access_token = process.env.GENIUS_ACCESS_TOKEN

export const getLyricsURL = async () => {
  const response = await currentlyPlaying()

  const song = await response.json()

  const artist = song.item.artists.map((artist: any) => artist.name).join(', ')
  const title = song.item.name

  return fetch(
    `https://api.genius.com/search?q=${encodeURIComponent(
      artist
    )}%20-%20${encodeURIComponent(title)}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`
      },
    }
  )
}
