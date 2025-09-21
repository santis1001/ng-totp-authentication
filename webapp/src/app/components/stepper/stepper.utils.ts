export interface step {
  name: string,
  displayName?: string,
  value: boolean,
  event: () => void
}

export type StepperSet = step[]