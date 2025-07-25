import { Prisma } from '@prisma/client/extension'
import { debug } from './debugger'
import { analyseDMMF, getDMMF } from './dmmf'
import { configureKeys, decryptOnRead, encryptOnWrite } from './encryption'
import { Configuration, MiddlewareParams } from './types'

export function fieldEncryptionExtension<
  Models extends string = any,
  Actions extends string = any
>(config: Configuration = {}) {
  const keys = configureKeys(config)
  debug.setup('Keys: %O', keys)

  // Try to get DMMF from config first, then try to detect it
  let dmmf = config.dmmf
  if (!dmmf) {
    try {
      dmmf = getDMMF()
    } catch (error) {
      // If DMMF detection fails, try to get it from the Prisma client that will be extended
      // This is a fallback for cases where the DMMF is not available at extension creation time
      debug.setup(
        'DMMF detection failed, will try to get it from the extended client: %O',
        error
      )
    }
  }

  if (!dmmf) {
    throw new Error(
      '[prisma-field-encryption] Could not access Prisma DMMF. Please provide it explicitly in the configuration or ensure the Prisma client is properly generated.'
    )
  }

  const models = analyseDMMF(dmmf)
  debug.setup('Models: %O', models)

  return Prisma.defineExtension({
    name: 'prisma-field-encryption',
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          if (!model) {
            // Unsupported operation
            debug.runtime(
              'Unsupported operation %s (missing model): %O',
              operation,
              args
            )
            return await query(args)
          }
          const params: MiddlewareParams<Models, Actions> = {
            args,
            model: model as Models,
            action: operation as Actions,
            dataPath: [],
            runInTransaction: false
          }
          const encryptedParams = encryptOnWrite(
            params,
            keys,
            models,
            operation
          )
          let result = await query(encryptedParams.args)
          decryptOnRead(encryptedParams, result, keys, models, operation)
          return result
        }
      }
    }
  })
}
