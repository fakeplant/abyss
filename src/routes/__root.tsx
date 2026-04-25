import { createRootRoute, Outlet } from "@tanstack/react-router"
import { MantineProvider } from "@mantine/core"
import { Notifications } from "@mantine/notifications"
import { theme } from "../lib/theme/theme"
import { resolver } from "../lib/theme/variables"
import Layout from "../components/Layout/Layout"

import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css"

export const Route = createRootRoute({
  component: () => (
    <MantineProvider
      theme={theme}
      cssVariablesResolver={resolver}
      forceColorScheme="light"
    >
      <Notifications />
      <Layout>
        <Outlet />
      </Layout>
    </MantineProvider>
  ),
})
