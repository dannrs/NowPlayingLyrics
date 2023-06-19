import React, { useEffect, useState } from 'react'
import useSWR, { mutate } from 'swr'
import fetcher from '@/lib/fetcher'

const LyricsComponent = () => {
  const [lyricsText, setLyricsText] = useState('')
  const address = '/api/spotify/lyrics'

  const { data: lyrics } = useSWR(address, fetcher)

  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        if (lyrics.lyricsUrl) {
          const response = await fetch(
            `https://weeb-api.vercel.app/lyrics?url=${lyrics.lyricsUrl}`
          )
          const data = await response.text()
          const deleteQuotes = data.replace(/^"|"$/g, '')
          const formattedLyrics = deleteQuotes.replace(
            /\[(.*?)\]/g,
            (match, group) => {
              const withoutNewlines = group.replace(/\\n/g, '')
              return `[${withoutNewlines}]`
            }
          )
          setLyricsText(formattedLyrics)
        }
      } catch (error) {
        console.log('Error:', error)
      }
    }

    if (!lyrics) {
      return
    }

    fetchLyrics()
    mutate(address)
  }, [lyrics])

  console.log(lyricsText)
  return (
    <div className="mb-8 mt-8 pl-4 pr-4 text-center">
      {lyricsText === '' || lyricsText === '{"error":"Failed"}' ? (
        <p>No lyrics found.</p>
      ) : (
        lyricsText.split('\\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))
      )}
    </div>
  )
}

export default LyricsComponent
