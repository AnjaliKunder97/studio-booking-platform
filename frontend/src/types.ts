export interface User {
  id: number
  email: string
  full_name?: string
}

export interface Resource {
  id: number
  name: string
  description?: string
  location?: string
}

export interface Booking {
  id: number
  resource_id: number
  user_id: number
  start_time: string
  end_time: string
}
