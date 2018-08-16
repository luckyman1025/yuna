// tslint:disable:no-use-before-declare
import { ActionContext } from 'vuex'

import * as crunchyroll from '@/lib/crunchyroll'
import { RootState } from '@/state/store'
import { getStoreAccessors } from 'vuex-typescript'

interface CrunchyrollData extends crunchyroll.CrunchyrollUser {
  token: string
  expires: Date
}

export interface AuthState {
  sessionId: string
  crunchyroll: CrunchyrollData | null
}

type AuthContext = ActionContext<AuthState, RootState>

const initialState: AuthState = {
  sessionId: '',
  crunchyroll: JSON.parse(localStorage.getItem('crunchyroll') || 'null'),
}

export const auth = {
  state: { ...initialState },

  getters: {
    isLoggedIn(state: AuthState) {
      return state.crunchyroll ? state.crunchyroll.token != null : false
    },
  },

  mutations: {
    setSessionId(state: AuthState, sessionId: string) {
      state.sessionId = sessionId
    },

    setCrunchyroll(state: AuthState, data: CrunchyrollData) {
      state.crunchyroll = { ...data }
    },
  },

  actions: {
    async createSession(context: AuthContext) {
      const sessionId = await crunchyroll.createSession()
      setSessionId(context, sessionId)
    },

    async loginCrunchyroll(
      context: AuthContext,
      payload: { user: string; pass: string },
    ) {
      try {
        const data = await crunchyroll.login(
          payload.user,
          payload.pass,
          context.state.sessionId,
        )

        const crunchyrollData: CrunchyrollData = {
          ...data.user,
          token: data.auth,
          expires: data.expires,
        }

        localStorage.setItem('crunchyroll', JSON.stringify(crunchyrollData))

        setCrunchyroll(context, crunchyrollData)
      } catch (err) {
        return
      }
    },
  },
}

const { commit, dispatch, read } = getStoreAccessors<AuthState, RootState>('')

export const isLoggedIn = read(auth.getters.isLoggedIn)

const setSessionId = commit(auth.mutations.setSessionId)
const setCrunchyroll = commit(auth.mutations.setCrunchyroll)

export const createSession = dispatch(auth.actions.createSession)
export const loginCrunchyroll = dispatch(auth.actions.loginCrunchyroll)
