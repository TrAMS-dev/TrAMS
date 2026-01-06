import '@sanity/cli'

declare module '@sanity/cli' {
  interface CliConfig {
    typegen?: {
      path: string
      schema: string
      generates: string
      overloadClientMethods?: boolean
    }
  }
}
