/**
 * Custom response wrapper to add additional properties to response
 */
export class MochiResponse {
  private _status = 200
  private headers: { [key: string]: string } = {}

  setHeader(key: string, value: string) {
    this.headers[key] = value
    return this
  }

  getHeader(key: string) {
    return this.headers[key]
  }

  status(value: number) {
    this._status = value
    return this
  }

  text(value: string) {
    this.setHeader('Content-Type', 'text/plain')
    return new Response(value, { status: this._status, headers: this.headers })
  }

  json(value: object) {
    this.setHeader('Content-Type', 'application/json')
    return new Response(JSON.stringify(value), { status: this._status, headers: this.headers })
  }

  html(value: string) {
    this.setHeader('Content-Type', 'text/html')
    return new Response(value, { status: this._status, headers: this.headers })
  }

  error(value: string, status: number = 500) {
    this._status = status
    return this.text(value)
  }

  lost(value: string) {
    this._status = 404
    return this.text(value)
  }

  unauthorized(value: string) {
    this._status = 401
    return this.text(value)
  }
}
