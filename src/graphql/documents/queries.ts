import gql from 'graphql-tag'
import { ANILIST_LIST_ENTRY_FRAGMENT } from '@/graphql/documents/fragments'

export const LIST_ENTRY_SCORE_QUERY = gql`
  query ListEntry($mediaId: Int!) {
    ListEntry(mediaId: $mediaId) @client {
      id
      score
    }
  }
`

export const MEDIA_LIST_ENTRY_FROM_MEDIA_ID = gql`
  query MediaListEntryFromMediaId($mediaId: Int!, $userId: Int!) {
    MediaList(userId: $userId, mediaId: $mediaId) {
      ...AniListEntry
    }
  }

  ${ANILIST_LIST_ENTRY_FRAGMENT}
`

export const EPISODE_LIST = gql`
  query EpisodeList($id: Int!, $provider: Provider!) {
    episodes: Episodes(id: $id, provider: $provider) @client {
      provider
      id
      animeId
      title
      duration
      progress
      index
      episodeNumber
      url
      subtitles
      thumbnail
      isWatched
    }
  }
`

export const MAL_ID_FROM_ANILIST_ID = gql`
  query MalIdFromAnilistId($mediaId: Int!) {
    Media(id: $mediaId) {
      idMal
    }
  }
`

export const EPISODE_FEED_LIST_IDS = gql`
  query EpisodeFeedListIds {
    ListEntries(page: 0, perPage: 10) @client {
      id
      mediaId
    }
  }
`
