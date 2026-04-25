import { ActionIcon, Box, Burger, Paper, Text } from "@mantine/core"
import { IconFocusCentered } from "@tabler/icons-react"
import cx from "clsx"
import type { ReactNode } from "react"
import Menu from "../Menu/Menu"
import { useAbyssStore } from "../../hooks/useAbyssStore"
import classes from "./Layout.module.css"

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  const { menuOpen, setMenuOpen } = useAbyssStore()

  return (
    <>
      <Box className={classes.menuToggle}>
        <Paper
          radius="sm"
          p="xs"
          withBorder
          w="44px"
          h="44px"
          className={classes.menuButton}
        >
          <Burger
            onClick={() => setMenuOpen(!menuOpen)}
            opened={menuOpen}
            aria-label="Toggle controls"
            size="sm"
          />
        </Paper>
      </Box>
      <Box className={cx(classes.wrapper, menuOpen && classes.open)}>
        <Menu />
        <main className={classes.content}>{children}</main>
      </Box>
      <Box className={classes.brand}>
        <ActionIcon
          variant="default"
          radius="sm"
          aria-label="Abyss structural visualizer"
          title="Abyss structural visualizer"
        >
          <IconFocusCentered size={18} />
        </ActionIcon>
        <Text
          fw="bold"
          tt="uppercase"
          size="sm"
          className={classes.brandText}
        >
          Abyss
        </Text>
      </Box>
    </>
  )
}

export default Layout
