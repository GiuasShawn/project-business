import { env } from '@loom/config'

export interface AuthConfig {
  secret: string
  jwtExpiresIn: string
  refreshTokenExpiresIn: string
  cookieDomain: string
}

export const auth: AuthConfig = {
  secret: env.BETTER_AUTH_SECRET,
  jwtExpiresIn: env.JWT_EXPIRES_IN,
  refreshTokenExpiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
  cookieDomain: env.COOKIE_DOMAIN,
}
