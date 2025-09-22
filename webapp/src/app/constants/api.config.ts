const baseHref = 'http://localhost:8080'
const context = '/api/v1/totp'

export const apiConfig = {
  register: baseHref + context + '/register',
  image: (token: string) => baseHref + context + `/image/${token}.png`,
  ping: (token: string) => baseHref + context + `/ping/${token}`,
  validate: baseHref + context + '/validate',
}