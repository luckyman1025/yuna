import { DataProxy } from 'apollo-cache'
import gql from 'graphql-tag'
import { oc } from 'ts-optchain'

import { EPISODE_LIST, LIST_VIEW_QUERY } from '@/graphql/documents/queries'
import {
  CachedAnimeListEntryFragment,
  EpisodeListEpisodes,
  EpisodeListQuery,
  EpisodeListVariables,
  ListViewListEntries,
  ListViewQuery,
  ListViewQueryVariables,
  MediaListStatus,
  Provider,
} from '@/graphql/types'

import { EpisodeCache } from '@/lib/episode-cache'
import { EpisodeRelations } from '@/lib/relations'
import { isNil } from '.'

export const getFragment = <R extends {}, V = void>(
  cache: DataProxy,
  { id, fragment, fragmentName, variables }: DataProxy.Fragment<V>,
): R | null => {
  try {
    return cache.readFragment<R, V>({ id, fragment, fragmentName, variables })
  } catch (e) {
    return null
  }
}

export const getIsWatched = (
  cache: DataProxy,
  animeId: number,
  episode: number,
) => {
  const data = getFragment<CachedAnimeListEntryFragment>(cache, {
    id: `Media:${animeId}`,
    fragment: gql`
      fragment CachedAnimeListEntry on Media {
        listEntry {
          progress
        }
      }
    `,
  })

  const progress = oc(data).listEntry.progress()
  if (isNil(progress)) {
    return false
  }

  return progress >= episode
}

export const getCachedAnimeIdMal = (
  cache: DataProxy,
  animeId: number,
): number | null => {
  const data = getFragment<{ idMal: number | null }>(cache, {
    id: `Media:${animeId}`,
    fragment: gql`
      fragment CachedMALId on Media {
        idMal
      }
    `,
  })

  return oc(data).idMal() || null
}

interface CachedExternalLinks {
  externalLinks: Array<{ site: string; url: string }>
}

export const getCachedExternalLinks = (
  cache: DataProxy,
  animeId: number,
): CachedExternalLinks['externalLinks'] | null => {
  const data = getFragment<CachedExternalLinks>(cache, {
    id: `Media:${animeId}`,
    fragment: gql`
      fragment CachedExternalLinks on Media {
        externalLinks {
          site
          url
        }
      }
    `,
  })

  return oc(data).externalLinks() || null
}

interface CachedAiringData {
  nextAiringEpisode: {
    airingAt: number
  }
}

const getNextEpisodeAiringAt = (
  cache: DataProxy,
  animeId: number,
): number | null => {
  const data = getFragment<CachedAiringData, void>(cache, {
    fragment: gql`
      fragment CacheAiringData on Media {
        nextAiringEpisode {
          airingAt
        }
      }
    `,
    id: `Media:${animeId}`,
  })

  const airingAt = oc(data).nextAiringEpisode.airingAt()

  return !isNil(airingAt) ? airingAt * 1000 : null
}

export const getSoftCachedEpisodes = (
  cache: DataProxy,
  animeId: number,
  provider: Provider,
): EpisodeListEpisodes[] | null => {
  try {
    const data = cache.readQuery<EpisodeListQuery, EpisodeListVariables>({
      query: EPISODE_LIST,
      variables: {
        id: animeId,
        provider,
      },
    })

    return oc(data).episodes() || null
  } catch (e) {
    return null
  }
}

export const cacheEpisodes = (
  cache: DataProxy,
  episodes: EpisodeListEpisodes[],
) => {
  episodes = episodes.map(ep => ({
    ...ep,
    isWatched:
      ep.isWatched || getIsWatched(cache, ep.animeId, ep.episodeNumber),
  }))

  if (episodes.length < 1) {
    return []
  }

  const { animeId, provider } = episodes[0]
  let nextEpisodeAiringAt = getNextEpisodeAiringAt(cache, animeId)

  cache.writeQuery<EpisodeListQuery, EpisodeListVariables>({
    query: EPISODE_LIST,
    variables: { id: animeId, provider },
    data: { episodes },
  })

  EpisodeCache.set(animeId, provider, episodes, nextEpisodeAiringAt)
}

export const cacheRelations = (
  cache: RealProxy,
  relations: EpisodeRelations,
) => {
  Object.values(relations).forEach((episodes: EpisodeListEpisodes[]) => {
    cacheEpisodes(cache, episodes)
  })
}

export interface EpisodeMutationObject {
  animeId: number
  provider: Provider
  episodeNumber: number
}

export const writeEpisodeProgressToCache = (
  cache: DataProxy,
  episode: EpisodeMutationObject,
  progress: number,
) => {
  let episodes = getSoftCachedEpisodes(cache, episode.animeId, episode.provider)

  if (isNil(episodes)) {
    const data = EpisodeCache.get(episode.animeId, episode.provider)
    episodes = oc(data).episodes() || null
  }

  if (isNil(episodes)) return

  episodes = episodes.map(ep => ({
    ...ep,
    isWatched: progress >= ep.episodeNumber,
  }))

  cacheEpisodes(cache, episodes)
}

export const getRows = (status: MediaListStatus) => {
  if (status === MediaListStatus.Planning) return 2

  return 1
}

export const removeFromCacheList = (cache: DataProxy, anilistId: number) => {
  for (let i = 1; i < 100; i++) {
    let data: ListViewQuery

    try {
      data = cache.readQuery<ListViewQuery, ListViewQueryVariables>({
        query: LIST_VIEW_QUERY,
        variables: {},
      })!

      const index = data.ListEntries.findIndex(
        entry => entry.mediaId === anilistId,
      )

      if (index === -1) continue

      const newData = { ListEntries: [...data.ListEntries] }
      newData.ListEntries.splice(index, 1)

      cache.writeQuery<ListViewQuery, ListViewQueryVariables>({
        query: LIST_VIEW_QUERY,
        variables: {},
        data: newData,
      })
    } catch (e) {
      break
    }
  }
}

export const addToCacheList = (
  cache: DataProxy,
  entry: ListViewListEntries,
) => {
  let data: ListViewQuery

  try {
    data = cache.readQuery<ListViewQuery, ListViewQueryVariables>({
      query: LIST_VIEW_QUERY,
      variables: {},
    })!
  } catch (e) {
    return
  }

  const newData = { ListEntries: [entry, ...data.ListEntries] }
  cache.writeQuery<ListViewQuery, ListViewQueryVariables>({
    query: LIST_VIEW_QUERY,
    variables: {},
    data: newData,
  })
}
