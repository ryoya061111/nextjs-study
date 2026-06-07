import { profileRepository } from '@/services/profile/shared/profileRepository'

export async function GET() {
  return Response.json(profileRepository.get())
}

export async function PUT(request: Request) {
  const body = await request.json()
  const updated = profileRepository.update(body)
  return Response.json(updated)
}
