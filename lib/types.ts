export type SpotifyTrack = {
  id: number;
  title: string;
  url: string;
  coverImage: {
    url: string;
  };
  artist: string;
};

export type SpotifyArtist = {
  id: number;
  name: string;
  url: string;
  coverImage: {
    url: string;
  };
  popularity: number;
};

export type Song = {
  album: string;
  artist: string;
  albumImageUrl: string;
  isPlaying: boolean;
  songUrl: string;
  title: string;
};
