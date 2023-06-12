
export type LoginInputType = {}

export type OnboardingInputType = {
  business_name: string
  location: string
}

export type QueueUserInputType = {
  email: string
  phone: string
}

export interface User {
  name: string
  email: string
  attending_to: boolean
}
