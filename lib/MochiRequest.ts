import type { Body, Params, QueryParams } from './types'

/**
 * Custom request class to add additional properties to request
 */
export class MochiRequest extends Request {
  params: Params
  query: QueryParams
  body: Body
  route: string
}
