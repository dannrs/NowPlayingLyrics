import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import fetcher from '@/lib/fetcher'

const LyricsComponent = () => {
  const [lyricsText, setLyricsText] = useState('')
  const [selectedLyrics, setSelectedLyrics] = useState('romanized')
  const address = '/api/spotify/lyrics'

  const { data: lyrics } = useSWR(address, fetcher, { refreshInterval: 1000 })

  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        if (lyrics.artist) {
          let selectedUrl = lyrics.lyricsUrlRo

          if (selectedLyrics === 'romanized' && !lyrics.lyricsUrlRo) {
            if (lyrics.lyricsUrlKo) {
              selectedUrl = lyrics.lyricsUrlKo
              setSelectedLyrics('korean')
            } else if (lyrics.lyricsUrlJa) {
              selectedUrl = lyrics.lyricsUrlJa
              setSelectedLyrics('japanese')
            } else if (lyrics.lyricsUrlEn) {
              selectedUrl = lyrics.lyricsUrlEn
              setSelectedLyrics('english')
            }
          } else if (selectedLyrics === 'korean' && lyrics.lyricsUrlKo) {
            selectedUrl = lyrics.lyricsUrlKo
          } else if (selectedLyrics === 'japanese' && lyrics.lyricsUrlJa) {
            selectedUrl = lyrics.lyricsUrlJa
          } else if (selectedLyrics === 'english' && lyrics.lyricsUrlEn) {
            selectedUrl = lyrics.lyricsUrlEn
          }

          const response = await fetch(
            `https://weeb-api.vercel.app/lyrics?url=${selectedUrl}`
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
  }, [lyrics, selectedLyrics])

  console.log(lyricsText)
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mt-8">
        <select
          className="bg-gray-800 p-1"
          value={selectedLyrics}
          onChange={e => setSelectedLyrics(e.target.value)}
        >
          <option value="romanized" disabled={!lyrics || !lyrics.lyricsUrlRo}>
            Romanized
          </option>
          <option value="korean" disabled={!lyrics || !lyrics.lyricsUrlKo}>
            Korean
          </option>
          <option value="japanese" disabled={!lyrics || !lyrics.lyricsUrlJa}>
            Japanese
          </option>
          <option value="english" disabled={!lyrics || !lyrics.lyricsUrlEn}>
            English
          </option>
        </select>
      </div>
      <div className="mb-8 mt-4 pl-4 pr-4 text-center">
        {lyricsText === '' || lyricsText === '{"parameters":"lyrics?url="}' ? (
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
    </div>
  )
}

export default LyricsComponent
