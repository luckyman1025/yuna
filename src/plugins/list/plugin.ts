import { Store } from 'vuex'
import { DollarApollo } from 'vue-apollo/types/vue-apollo'
import {
  AddToListMutation,
  ListEntry,
  MediaListStatus,
  Provider,
  StartRewatchingMutation,
  UpdateProgressMutation,
  UpdateScoreMutation,
  UpdateStatusMutation,
} from '@/graphql/types'

export abstract class ListPlugin {
  public abstract service: string

  protected readonly apollo: DollarApollo<any>
  protected readonly store: Store<any>

  protected constructor(apollo: DollarApollo<any>, store: Store<any>) {
    this.apollo = apollo
    this.store = store
  }

  public abstract async GetListEntry(anilistId: number): Promise<ListEntry | null>

  public abstract async AddToList(
    anilistId: number,
  ): Promise<AddToListMutation['AddToList']>

  public abstract async UpdateStatus(
    anilistId: number,
    status: MediaListStatus,
  ): Promise<UpdateStatusMutation['UpdateStatus']>

  public abstract async StartRewatching(
    anilistId: number,
  ): Promise<StartRewatchingMutation['StartRewatching']>

  public abstract async UpdateProgress(
    anilistId: number,
    progress: number,
    provider: Provider,
  ): Promise<UpdateProgressMutation['UpdateProgress']>

  public abstract async UpdateScore(
    anilistId: number,
    score: number,
  ): Promise<UpdateScoreMutation['UpdateScore']>

  public abstract async DeleteFromList(entryId: number): Promise<boolean>
}
