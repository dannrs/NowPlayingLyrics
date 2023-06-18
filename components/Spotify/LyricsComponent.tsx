import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import fetcher from '@/lib/fetcher'

const LyricsComponent = () => {
  const [lyricsText, setLyricsText] = useState('')
  const address = '/api/spotify/lyrics'

  const { data: lyrics} = useSWR(address, fetcher, {
  })

 useEffect(() => {
    const fetchLyrics = async () => {
      try {
        if (lyrics.lyricsUrl) {
          const response = await fetch(
            `https://weeb-api.vercel.app/lyrics?url=${lyrics.lyricsUrl}`
          )
          const data = await response.text()
          const formattedLyrics = data.replace(/^"|"$/g, '')
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
  }, [lyrics])

   return (
    <div className="mb-8 mt-8 pl-4 pr-4 text-center">
      {lyricsText.split('\\n').map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      ))}
    </div>
  )
}

export default LyricsComponent
