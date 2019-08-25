import {
  AddToListMutation,
  AddToListVariables,
  DeleteFromListMutation,
  DeleteFromListVariables,
  MediaListStatus,
  Provider,
  StartRewatchingMutation,
  StartRewatchingVariables,
  UpdateScoreMutation,
  UpdateScoreVariables,
  UpdateStatusMutation,
  UpdateStatusVariables,
} from '@/graphql/types'
import {
  ADD_TO_LIST,
  DELETE_FROM_LIST,
  START_REWATCHING,
  UPDATE_SCORE,
  UPDATE_STATUS,
} from '@/graphql/documents/mutations'
import {
  EpisodeMutationObject,
  refetchListQuery,
  writeEpisodeProgressToCache,
} from '@/utils/cache'
import { Instance } from '@/types'

export const addToList = async ({ $apollo }: Instance, anilistId: number) =>
  $apollo.mutate<AddToListMutation>({
    mutation: ADD_TO_LIST,
    variables: { anilistId } as AddToListVariables,
  })

export const deleteFromList = async (
  { $apollo }: Instance,
  anilistId: number,
) =>
  $apollo.mutate<DeleteFromListMutation>({
    mutation: DELETE_FROM_LIST,
    variables: { anilistId } as DeleteFromListVariables,
  })

export const updateStatus = async (
  { $apollo, $store }: Instance,
  anilistId: number,
  status: MediaListStatus,
) =>
  $apollo.mutate<UpdateStatusMutation>({
    mutation: UPDATE_STATUS,
    variables: { anilistId, status } as UpdateStatusVariables,
    refetchQueries: refetchListQuery($store),
  })

export const startRewatching = async (
  { $apollo, $store }: Instance,
  anilistId: number,
) => {
  await $apollo.mutate<StartRewatchingMutation>({
    mutation: START_REWATCHING,
    variables: { anilistId } as StartRewatchingVariables,
    refetchQueries: refetchListQuery($store),
    update: (cache, { data }) => {
      if (!data) return

      const fakeEpisode: EpisodeMutationObject = {
        provider: Provider.Crunchyroll,
        animeId: data.StartRewatching!.mediaId,
        episodeNumber: 0,
      }
      writeEpisodeProgressToCache(cache, fakeEpisode, 0)
    },
  })
}

export const updateScore = async (
  { $apollo }: Instance,
  anilistId: number,
  score: number,
) =>
  $apollo.mutate<UpdateScoreMutation>({
    mutation: UPDATE_SCORE,
    variables: { anilistId, score } as UpdateScoreVariables,
  })
