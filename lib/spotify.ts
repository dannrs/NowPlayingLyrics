import { IArtistAPIResponse, ITracksAPIResponse } from './interface'

type SpotifyAccessToken = {
  access_token: string
}

const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET
const refresh_token = process.env.SPOTIFY_CLIENT_REFRESH_TOKEN

const getAccessToken = async (): Promise<SpotifyAccessToken> => {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${client_id}:${client_secret}`
      ).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh_token!
    })
  })

  return response.json()
}

export const topTracks = async (): Promise<ITracksAPIResponse[]> => {
  const { access_token }: { access_token: string } = await getAccessToken()

  const response = await fetch(
    'https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term',
    {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch top artists.')
  }
  const data = await response.json()
  return data.items as ITracksAPIResponse[]
}

export const topArtists = async (): Promise<IArtistAPIResponse[]> => {
  const { access_token }: { access_token: string } = await getAccessToken()

  const response = await fetch(
    'https://api.spotify.com/v1/me/top/artists?limit=5&time_range=short_term',
    {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch to artists')
  }

  const data = await response.json()
  return data.items as IArtistAPIResponse[]
}

export const currentlyPlayed = async () => {
  const { access_token }: { access_token: string } = await getAccessToken()

  return fetch('https://api.spotify.com/v1/me/player/recently-played', {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  })
}

export const currentlyPlaying = async () => {
  const { access_token }: { access_token: string } = await getAccessToken()

  return fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  })
}
