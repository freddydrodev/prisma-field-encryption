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

  return Prisma.defineExtension({
    name: 'prisma-field-encryption',
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          // Get DMMF from the client instance being extended
          let dmmf = config.dmmf
          if (!dmmf) {
            try {
              // Try to get DMMF from the query context or global scope
              dmmf = getDMMF()
            } catch (error) {
              debug.setup(
                'Could not access DMMF: %O',
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
