import request from 'superagent/superagent'
import { T } from 'rambdax'

import { fetchSeasonFromEpisode } from '@/lib/crunchyroll'
import { Episode } from '@/types'
import { RequestResponse, responseIsError } from '@/utils'

const CRUNCHYROLL_PROVIDER_ID = '1'

const handleError = (response: RequestResponse) => {
  if (response.status === 404) {
    return []
  }

  if (response.status === 429) {
    return Promise.reject('Too many requests, try again later.')
  }

  return Promise.reject('Something went wrong!')
}

export const fetchEpisodesOfSeries = async (
  id: string | number,
): Promise<Episode[]> => {
  const baseUrl = `https://myanimelist.net/anime/${id}`
  const episodeResponse = (await request.get(baseUrl).ok(T)) as RequestResponse

  if (responseIsError(episodeResponse)) {
    return handleError(episodeResponse)
  }

  const episodesLinkMatch = episodeResponse.text.match(
    `(${baseUrl}\/.*\/episode)`,
  )
  if (!episodesLinkMatch || !episodesLinkMatch[1]) {
    return []
  }

  const videoUrl = episodesLinkMatch[0] + '/1'
  const response = (await request.get(videoUrl).ok(T)) as RequestResponse

  if (responseIsError(response)) {
    return handleError(response)
  }

  const providerMatch = /"provider_id":(\d)/m.exec(response.text)
  if (!providerMatch || providerMatch[1] !== CRUNCHYROLL_PROVIDER_ID) {
    return []
  }

  const mediaIdMatch = /"provider_episode_id":\s?(\d+)/m.exec(response.text)
  if (!mediaIdMatch || !mediaIdMatch[1]) {
    // tslint:disable-next-line:no-console
    console.error(`Couldn't find media_id for ${id}`)

    return []
  }

  return fetchSeasonFromEpisode(mediaIdMatch[1])
}

export const fetchRating = async (id: string | number) => {
  let response: RequestResponse | null = null

  try {
    response = (await request.get(
      `https://myanimelist.net/anime/${id}`,
    )) as RequestResponse
  } catch (e) {
    // noop
  }

  if (!response || responseIsError(response)) {
    throw new Error('Could not fetch MAL rating. 😟')
  }

  const match = /<div.*data-title="score".*>\s+?(.*)\s+?<\/div>/gm.exec(
    response.text,
  )

  if (!match || !match[1]) throw new Error('Could not find a MAL rating.')

  return match[1].trim()
}
