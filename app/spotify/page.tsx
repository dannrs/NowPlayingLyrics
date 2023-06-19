'use client'

import Image from 'next/image'
import useSWR from 'swr'
import fetcher from '@/lib/fetcher'
import { Song } from '@/lib/types'
import { SiSpotify } from 'react-icons/si'
import {RiZzzFill} from 'react-icons/ri'
import Link from 'next/link'
import SkeletonLoading from '@/components/SkeletonLoading'
import LyricsComponent from '@/components/Spotify/LyricsComponent'

export default function Spotify() {
  const { data: currentSong } = useSWR('/api/spotify/now-playing', fetcher, {
    refreshInterval: 1000
  })
  const { data: recentlyPlayed } = useSWR(
    '/api/spotify/recently-played',
    fetcher,
    { refreshInterval: 600000 }
  )

  return (
    <div className="flex flex-col min-h-screen items-center justify-start bg-gray-900 pt-8 font-sans text-white">
      <Image
        className="mb-2 rounded-full"
        src="/profile.jpg"
        alt="Photo Profile"
        width={128}
        height={128}
      />
      <h2>danniramdhani</h2>
      <p className="text-sm mb-8">Saya mencintai kucing, Linux dan Yorushika.</p>
      <div>
        {currentSong?.isPlaying ? (
          <Playing song={currentSong} />
        ) : (
          <NotPlaying song={recentlyPlayed} />
        )}
      </div>
      <div className='flex items-center justify-center w-2/3'>
        {currentSong?.isPlaying? (
        <LyricsComponent />
        ) : (
        <RiZzzFillCustom value='Offline'/>
        )}
      </div>
    </div>
  )
}

function RiZzzFillCustom({value}: {value: any}) {
  return (
  <div className='flex mt-8'>
      <RiZzzFill size={22}/>
      <div className='ml-1'>{value}</div>
    </div>
  )
}

function Playing({ song }: { song: Song }) {
  if (!song) {
    return <SkeletonLoading />
  }

  const title =
    song.title.length > 15 ? song.title.substring(0, 15) + '...' : song.title

  const artist =
    song.artist.length > 15 ? song.artist.substring(0, 15) + '...' : song.artist

  return (
    <div className="relative flex w-64 items-center justify-start overflow-hidden rounded-full">
      <Image
        className="blur-sm"
        src={song.albumImageUrl}
        alt={song.title}
        fill={true}
        style={{ objectFit: 'cover' }}
      />
      <div className="flex h-full w-full items-center">
        <Image
          className="relative animate-[spin_8s_linear_infinite] rounded-full"
          src={song.albumImageUrl}
          alt={song.title}
          width={48}
          height={48}
        />
        <div className="ml-4 mr-4 flex w-full flex-col items-center justify-evenly text-white">
          <p className="text-sm font-semibold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
            {title}
          </p>
          <p className="text-xs drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
            {artist}
          </p>
        </div>
        <Link
          className="mr-4"
          href={song.songUrl}
          rel="noreferrer"
          target="_blank"
        >
          <SiSpotify
            className="relative"
            size={18}
            style={{ fill: '#1DB954' }}
          />
        </Link>
      </div>
    </div>
  )
}

function NotPlaying({ song }: { song: Song }) {
  if (!song) {
    return <SkeletonLoading />
  }

  const title =
    song.title.length > 15 ? song.title.substring(0, 15) + '...' : song.title

  const artist =
    song.artist.length > 15 ? song.artist.substring(0, 15) + '...' : song.artist

  return (
    <div className="relative flex w-64 items-center justify-start overflow-hidden rounded-full">
      <Image
        className="blur-sm"
        src={song.albumImageUrl}
        alt={song.title}
        fill={true}
        style={{ objectFit: 'cover' }}
      />
      <div className="flex h-full w-full items-center">
        <Image
          className="relative rounded-full"
          src={song.albumImageUrl}
          alt={song.title}
          width={48}
          height={48}
        />
        <div className="ml-4 mr-4 flex w-full flex-col items-center justify-evenly text-white">
          <p className="text-sm font-semibold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
            {title}
          </p>
          <p className="text-xs drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
            {artist}
          </p>
        </div>
        <Link
          className="mr-4"
          href={song.songUrl}
          rel="noreferrer"
          target="_blank"
        >
          <SiSpotify
            className="relative"
            size={18}
            style={{ fill: '#1DB954' }}
          />
        </Link>
      </div>
    </div>
  )
}
