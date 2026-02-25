import type { QueryClient } from '@tanstack/react-query'

import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import { useImportPrompt } from '@/hooks/useImportPrompt'
import { ImportPrompt } from '@/ui/ImportPrompt'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => {
    const title = 'Ranky'
    const description =
      'Create album tracklist rankings and export them as an image to share with friends!'
    const url = 'https://ranky.luihh.dev/'
    const img = '/img/ranky-logo-rounded.png'

    return {
      meta: [
        {
          charSet: 'utf-8'
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1'
        },
        { title },
        { name: 'description', content: description },

        { name: 'og:title', content: title },
        { name: 'og:description', content: description },
        { name: 'og:image', content: img },
        { name: 'og:url', content: url },

        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: img },
        { name: 'twitter:url', content: url }
      ],
      links: [
        { rel: 'icon', href: img },
        { rel: 'canonical', href: 'https://ranky.luihh.dev' },
        {
          rel: 'stylesheet',
          href: appCss
        }
      ]
    }
  },

  shellComponent: RootDocument
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { showPrompt, localRankings, dismiss } = useImportPrompt()

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Scripts />
        {showPrompt && localRankings && (
          <ImportPrompt localRankings={localRankings} onDismiss={dismiss} />
        )}
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right'
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />
            },
            TanStackQueryDevtools
          ]}
        />
      </body>
    </html>
  )
}
