import { createFileRoute } from "@tanstack/react-router"
import Abyss from "../components/Canvas/Abyss"

export const Route = createFileRoute("/")({
  component: Abyss,
})
