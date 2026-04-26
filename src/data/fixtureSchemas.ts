import { z } from "zod"

const hexColorSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/)

export const fixtureGravityOrientationSchema = z.enum([
  "up",
  "down",
  "left",
  "right",
])

export const barFrontEmitterConfigSchema = z.object({
  id: z.string().min(1),
  color: hexColorSchema,
})

export const barFixtureConfigSchema = z.object({
  id: z.string().min(1),
  type: z.literal("bar"),
  mount: z.literal("edge"),
  mountEdgeId: z.string().min(1),
  edgeT: z.number().min(0).max(1).default(0.5),
  gravityOrientation: fixtureGravityOrientationSchema,
  rotationDeg: z.number().min(0).max(360),
  scaleFakeBeamWithRotation: z.boolean().default(true),
  frontEmitters: z.tuple([
    barFrontEmitterConfigSchema,
    barFrontEmitterConfigSchema,
    barFrontEmitterConfigSchema,
    barFrontEmitterConfigSchema,
    barFrontEmitterConfigSchema,
    barFrontEmitterConfigSchema,
    barFrontEmitterConfigSchema,
    barFrontEmitterConfigSchema,
  ]),
  rearCobColor: hexColorSchema,
})

export const barFixtureConfigListSchema = z.array(barFixtureConfigSchema)

export type FixtureGravityOrientation = z.infer<
  typeof fixtureGravityOrientationSchema
>
export type BarFrontEmitterConfig = z.infer<typeof barFrontEmitterConfigSchema>
export type BarFixtureConfig = z.infer<typeof barFixtureConfigSchema>
