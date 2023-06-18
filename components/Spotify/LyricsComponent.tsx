import React, { useEffect, useState } from 'react'
import useSWR, { mutate } from 'swr'
import fetcher from '@/lib/fetcher'

const LyricsComponent = () => {
  const [lyricsText, setLyricsText] = useState('')
  const address = '/api/spotify/lyrics'

  const { data: text } = useSWR(address, fetcher, {
  })

  useEffect(() => {
    if (text) {
    const lyrics = text.scrapedLyrics
    const formattedLyrics = lyrics.replace(/^"|"$/g, '')
    setLyricsText(formattedLyrics)}
  }, [text])

  mutate(address)

  if (!text) {
    return
  }
  return (
    <div className="mb-8 mt-8 pl-4 pr-4 text-center">
      {lyricsText.split('\n').map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      ))}
    </div>
  )
}

export default LyricsComponent
