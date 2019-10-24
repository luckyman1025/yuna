declare type UnPromisify<T> = T extends Promise<infer R> ? R : T

declare type PromiseReturnType<T> = T extends (...a: any[]) => Promise<infer R>
  ? R
  : T

declare type GlobalFetch = {
  fetch: typeof window.fetch
}

declare type CSSProps = Partial<
  Omit<
    CSSStyleDeclaration,
    | 'getPropertyPriority'
    | 'getPropertyValue'
    | 'item'
    | 'removeProperty'
    | 'setProperty'
  >
>

declare interface Level {
  attrs: {
    BANDWIDTH: number
    CODECS: string
    'FRAME-RATE': string
    'PROGRAM-ID': string
    RESOLUTION: string
  }
  bitrate: number
  details: {}
  name?: string
  height: number
  width: number
  level: number
  audioCodec: string
  videoCodec: string
  unknownCodecs: any[]
  urls: string[]
  urlId: number
  fragmentError: boolean
  loadError: number
}

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module '*.svg' {
  import Vue from 'vue'
  export default Vue
}

declare module '*.webp' {
  const content: string
  export default content
}

declare module 'superagent/dist/superagent' {
  import request from 'superagent'
  export = request
}

declare module 'vue-smooth-dnd' {
  import Vue, { VueConstructor } from 'vue'

  export const Container: VueConstructor<Vue>
  export const Draggable: VueConstructor<Vue>
}

declare interface Window {
  initialLogin: boolean
}

declare interface InputEvent<
  E extends HTMLInputElement | HTMLSelectElement = HTMLInputElement
> extends Event {
  currentTarget: E
  target: E
}

declare module 'vue-cli-plugin-apollo/graphql-client' {
  import { ApolloClientOptions, Resolvers } from 'apollo-client'
  import { ApolloLink, DocumentNode } from 'apollo-link'
  import { FetchOptions } from 'apollo-link-http'
  import { ClientStateConfig } from 'apollo-link-state'
  import { ApolloCache } from 'apollo-cache'
  import { InMemoryCacheConfig } from 'apollo-cache-inmemory'

  interface CreateClientOptions {
    /** URL to the HTTP API */
    httpEndpoint: string
    /** Url to the Websocket API; set `null` to disable websockets */
    wsEndpoint?: string | null
    /** Token used in localstorage */
    tokenName?: string
    /** Enable this if you use Query persisting with Apollo Engine */
    persisting?: boolean
    /** Is currently Server-Side Rendering or not */
    ssr?: boolean
    /** Only use Websocket for all requests (including queries and mutations) */
    websocketsOnly?: boolean
    /**
     * Custom starting link.
     * If you want to replace the default HttpLink , set `defaultHttpLink` to false
     */
    link?: ApolloLink
    /**
     * If true, add the default HttpLink.
     * Disable it if you want to replace it with a terminating link using `link` option.
     */
    defaultHttpLink?: boolean
    /** Options for the default HttpLink */
    httpLinkOptions?: FetchOptions
    /** Custom Apollo cache implementation (default is apollo-cache-inmemory) */
    cache?: ApolloCache<any>
    /** Options for the default cache */
    inMemoryCacheOptions?: InMemoryCacheConfig
    /** Additional Apollo client options */
    apollo?: ApolloClientOptions<any>
    /** apollo-link-state options */
    clientState?: ClientStateConfig
    /** Function returning Authorization header token */
    getAuth?: (tokenName?: string) => string

    typeDefs?: DocumentNode
    resolvers?: Resolvers
  }

  export const createApolloClient: (
    options: CreateClientOptions,
  ) => {
    apolloClient: any
    wsClient: any
    stateLink: any
  }

  export const restartWebsockets: (a: any) => void
}

declare module '*/package.json' {
  const content: {
    version: string
    [key: string]: any
  }
  export = content
}

declare module 'vue-notifications' {
  import { PluginFunction } from 'vue'

  export type NotificationTypes = 'success' | 'info' | 'warning' | 'error'

  export interface NotificationFunctionOptions<T> {
    title: string
    message: string
    type: T
    timeout?: number
    consoleMessage?: string
  }

  export interface NotificationPluginOptions {
    type?: NotificationTypes
    timeout?: number
    success?: (options: NotificationFunctionOptions<'success'>) => void
    info?: (options: NotificationFunctionOptions<'info'>) => void
    warning?: (options: NotificationFunctionOptions<'warning'>) => void
    error?: (options: NotificationFunctionOptions<'error'>) => void
  }

  const plugin: PluginFunction<NotificationPluginOptions>

  export default plugin
}

declare module 'v-tooltip' {
  import { PluginObject } from 'vue'

  type Triggers =
    | 'hover'
    | 'click'
    | 'focus'
    | 'hover click'
    | 'hover focus'
    | 'click focus'
    | 'click hover focus'
    | 'manual'

  export interface TooltipSettings {
    content: string
    loadingContent?: string
    classes?: string[]
    targetClasses?: string[]
    loadingClass?: string[]
    html?: boolean
    show?: boolean
    trigger?: Triggers
    autoHide?: boolean
    hideOnTargetClick?: boolean
    delay?:
      | number
      | {
          show: number
          hide: number
        }
    placement?:
      | 'auto'
      | 'auto-start'
      | 'auto-end'
      | 'top'
      | 'top-start'
      | 'top-end'
      | 'right'
      | 'right-start'
      | 'right-end'
      | 'bottom'
      | 'bottom-start'
      | 'bottom-end'
      | 'left'
      | 'left-start'
      | 'left-end'
    offset?: number
    container?: string
    arrowSelector?: string
    innerSelector?: string
    popperOptions?: any
  }

  const plugin: PluginObject<{}>

  export default plugin
}

declare module 'anitomyscript' {
  interface AnitomyElement {
    readonly anime_season?: string
    readonly anime_season_prefix?: string
    readonly anime_title?: string
    readonly anime_type?: string
    readonly anime_year?: string
    readonly audio_term?: string
    readonly device_compatibility?: string | string[]
    readonly episode_number?: string
    readonly episode_number_alt?: string
    readonly episode_prefix?: string
    readonly episode_title?: string
    readonly file_checksum?: string
    readonly file_extension?: string
    readonly file_name?: string
    readonly language?: string
    readonly other?: string | string[]
    readonly release_group?: string
    readonly release_information?: string
    readonly release_version?: string
    readonly source?: string
    readonly subtitles?: string
    readonly video_resolution?: string
    readonly video_term?: string
    readonly volume_number?: string
    readonly volume_prefix?: string
  }

  interface AnitomyOptions {
    allowed_delimiters?: string
    ignored_strings?: string[]
    parse_episode_number?: boolean
    parse_episode_title?: boolean
    parse_file_extension?: boolean
    parse_release_group?: boolean
  }

  const content: {
    /**
     * Parses the filenames synchronously.
     */
    parse(filename: string, options?: AnitomyOptions): AnitomyElement
  }

  export = content
}
