import { decodeMessage, encodeMessage, message, streamMessage } from 'protons-runtime'
import type { Codec, DecodeOptions } from 'protons-runtime'
import type { Uint8ArrayList } from 'uint8arraylist'

export interface Exchange {
  id?: Uint8Array<ArrayBuffer>
  pubkey?: Uint8Array<ArrayBuffer>
}

export interface ExchangeInput {
  id?: Uint8Array
  pubkey?: Uint8Array
}

export namespace Exchange {
  let _codec: Codec<Exchange, ExchangeInput>

  export const codec = (): Codec<Exchange, ExchangeInput> => {
    if (_codec == null) {
      _codec = message<Exchange, ExchangeInput>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (obj.id != null) {
          w.uint32(10)
          w.bytes(obj.id)
        }

        if (obj.pubkey != null) {
          w.uint32(18)
          w.bytes(obj.pubkey)
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (r, length) => {
        const obj: any = {}

        const end = length == null ? r.len : r.pos + length

        while (r.pos < end) {
          const tag = r.uint32()

          switch (tag >>> 3) {
            case 1: {
              obj.id = r.bytes()
              break
            }
            case 2: {
              obj.pubkey = r.bytes()
              break
            }
            default: {
              r.skipType(tag & 7)
              break
            }
          }
        }

        return obj
      }, function * (r, length, prefix) {
        const end = length == null ? r.len : r.pos + length

        if (prefix !== '.') {
          yield {
            field: prefix.endsWith('.') ? prefix.substring(0, prefix.length - 1) : prefix,
            type: 'start',
            message: 'Exchange'
          }
        }

        while (r.pos < end) {
          const tag = r.uint32()

          switch (tag >>> 3) {
            case 1: {
              yield {
                field: `${prefix}id`,
                value: r.bytes()
              }
              break
            }
            case 2: {
              yield {
                field: `${prefix}pubkey`,
                value: r.bytes()
              }
              break
            }
            default: {
              r.skipType(tag & 7)
              break
            }
          }
        }

        if (prefix !== '.') {
          yield {
            field: prefix.endsWith('.') ? prefix.substring(0, prefix.length - 1) : prefix,
            type: 'end',
            message: 'Exchange'
          }
        }
      })
    }

    return _codec
  }

  export interface ExchangeIdFieldEvent {
    field: '.id'
    value: Uint8Array<ArrayBuffer>
  }

  export interface ExchangePubkeyFieldEvent {
    field: '.pubkey'
    value: Uint8Array<ArrayBuffer>
  }

  export function encode (obj: ExchangeInput): Uint8Array<ArrayBuffer> {
    return encodeMessage(obj, Exchange.codec())
  }

  export function decode (buf: Uint8Array | Uint8ArrayList, opts?: DecodeOptions<Exchange>): Exchange {
    return decodeMessage(buf, Exchange.codec(), opts)
  }

  export function stream (buf: Uint8Array | Uint8ArrayList, opts?: DecodeOptions<Exchange>): Generator<ExchangeIdFieldEvent | ExchangePubkeyFieldEvent> {
    return streamMessage(buf, Exchange.codec(), opts)
  }
}
