import axiosClient from './axiosClient'

/**
 * Fetch current user's full profile including both auth and profile data
 */
export async function getCurrentUserProfile() {
  const [authResponse, profileResponse] = await Promise.all([
    axiosClient.get('/api/auth/me'),
    axiosClient.get('/api/profile/me').catch(() => ({ data: { profile: null } })),
  ])

  const user = authResponse.data?.user
  const profile = profileResponse.data?.profile

  return {
    user,
    profile,
  }
}

/**
 * Update current user's profile
 */
export async function updateUserProfile(profileData) {
  const response = await axiosClient.put('/api/profile/me', profileData)
  return response.data?.profile
}

/**
 * Delete current user's profile
 */
export async function deleteUserProfile() {
  const response = await axiosClient.delete('/api/profile/me')
  return response.data
}
