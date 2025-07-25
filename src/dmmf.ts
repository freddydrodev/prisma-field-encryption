import type { Encoding } from '@47ng/codec'
import { z } from 'zod'
import { errors, warnings } from './errors'
import {
  DMMFDocument,
  FieldConfiguration,
  HashFieldConfiguration,
  HashFieldNormalizeOptions,
  dmmfDocumentParser
} from './types'

export interface ConnectionDescriptor {
  modelName: string
  isList: boolean
}

export interface DMMFModelDescriptor {
  /**
   * The field to use to iterate over rows
   * in encryption/decryption/key rotation migrations.
   *
   * See https://github.com/47ng/prisma-field-encryption#migrations
   */
  cursor?: string
  fields: Record<string, FieldConfiguration> // key: field name
  connections: Record<string, ConnectionDescriptor> // key: field name
}

export type DMMFModels = Record<string, DMMFModelDescriptor> // key: model name

const supportedCursorTypes = ['Int', 'String', 'BigInt']

export function analyseDMMF(input: DMMFDocument): DMMFModels {
  const dmmf = dmmfDocumentParser.parse(input)
  const allModels = dmmf.datamodel.models

  return allModels.reduce<DMMFModels>((output, model) => {
    const idField = model.fields.find(
      field => field.isId && supportedCursorTypes.includes(String(field.type))
    )
    const uniqueField = model.fields.find(
      field =>
        field.isUnique && supportedCursorTypes.includes(String(field.type))
    )
    const cursorField = model.fields.find(field =>
      field.documentation?.includes('@encryption:cursor')
    )
    if (cursorField) {
      // Make sure custom cursor field is valid
      if (!cursorField.isUnique) {
        throw new Error(errors.nonUniqueCursor(model.name, cursorField.name))
      }
      if (!supportedCursorTypes.includes(String(cursorField.type))) {
        throw new Error(
          errors.unsupportedCursorType(
            model.name,
            cursorField.name,
            String(cursorField.type)
          )
        )
      }
      if (cursorField.documentation?.includes('@encrypted')) {
        throw new Error(errors.encryptedCursor(model.name, cursorField.name))
      }
    }

    const modelDescriptor: DMMFModelDescriptor = {
      cursor: cursorField?.name ?? idField?.name ?? uniqueField?.name,
      fields: model.fields.reduce<DMMFModelDescriptor['fields']>(
        (fields, field) => {
          const fieldConfig = parseEncryptedAnnotation(
            field.documentation,
            model.name,
            field.name
          )
          if (fieldConfig && field.type !== 'String') {
            throw new Error(errors.unsupportedFieldType(model, field))
          }
          return fieldConfig ? { ...fields, [field.name]: fieldConfig } : fields
        },
        {}
      ),
      connections: model.fields.reduce<DMMFModelDescriptor['connections']>(
        (connections, field) => {
          const targetModel = allModels.find(model => field.type === model.name)
          if (!targetModel) {
            return connections
          }
          const connection: ConnectionDescriptor = {
            modelName: targetModel.name,
            isList: field.isList
          }
          return {
            ...connections,
            [field.name]: connection
          }
        },
        {}
      )
    }
    // Inject hash information
    model.fields.forEach(field => {
      const hashConfig = parseHashAnnotation(
        field.documentation,
        model.name,
        field.name
      )
      if (!hashConfig) {
        return
      }
      if (field.type !== 'String') {
        throw new Error(errors.unsupporteHashFieldType(model, field))
      }
      const { sourceField, ...hash } = hashConfig
      if (!(sourceField in modelDescriptor.fields)) {
        throw new Error(
          errors.hashSourceFieldNotFound(model, field, sourceField)
        )
      }
      modelDescriptor.fields[hashConfig.sourceField].hash = hash
    })

    if (
      Object.keys(modelDescriptor.fields).length > 0 &&
      !modelDescriptor.cursor
    ) {
      console.warn(warnings.noCursorFound(model.name))
    }
    return {
      ...output,
      [model.name]: modelDescriptor
    }
  }, {})
}

/**
 * Get DMMF from Prisma client, handling different Prisma versions and custom locations
 */
export function getDMMF() {
  try {
    // Try to get DMMF from the current module's Prisma import
    // This works for both default and custom Prisma client locations
    const moduleCache = require.cache
    const prismaModules = Object.keys(moduleCache).filter(
      key => key.includes('@prisma/client') || key.includes('prisma')
    )

    for (const modulePath of prismaModules) {
      try {
        const module = moduleCache[modulePath]
        if (module && module.exports) {
          // Try to get Prisma from the module exports
          const Prisma = module.exports.Prisma || module.exports
          if (Prisma && Prisma.dmmf) {
            return Prisma.dmmf
          }
        }
      } catch (e) {
        // Continue to next module
        continue
      }
    }

    // Fallback: Try the default @prisma/client location
    try {
      const { Prisma } = require('@prisma/client')
      if (Prisma.dmmf) {
        return Prisma.dmmf
      }
    } catch (e) {
      // Continue to next fallback
    }

    // Final fallback: Try the old pattern
    try {
      return require('@prisma/client').Prisma.dmmf
    } catch (e) {
      // This will be caught by the outer try-catch
    }

    throw new Error('No DMMF found in any Prisma client modules')
  } catch (error) {
    throw new Error(
      `[prisma-field-encryption] Could not access Prisma DMMF. This might be due to:
1. Prisma client not being generated (run 'prisma generate')
2. Incompatible Prisma version
3. Custom Prisma client location not properly configured

Error: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

// --

const encryptedAnnotationRegex = /@encrypted(?<query>\?[\w=&]+)?/
const hashAnnotationRegex =
  /@encryption:hash\((?<fieldName>\w+)\)(?<query>\?[\w=&]+)?/

export function parseEncryptedAnnotation(
  annotation = '',
  model?: string,
  field?: string
): FieldConfiguration | null {
  const match = annotation.match(encryptedAnnotationRegex)
  if (!match) {
    return null
  }
  const query = new URLSearchParams(match.groups?.query ?? '')
  const strict = query.get('strict') !== null
  const readonly = query.get('readonly') !== null
  if (strict && process.env.NODE_ENV === 'development' && model && field) {
    console.warn(warnings.deprecatedModeAnnotation(model, field, 'strict'))
  }
  if (readonly && process.env.NODE_ENV === 'development' && model && field) {
    console.warn(warnings.deprecatedModeAnnotation(model, field, 'readonly'))
  }
  const mode =
    query.get('mode') ?? (readonly ? 'readonly' : strict ? 'strict' : 'default')
  /* istanbul ignore next */
  if (!['default', 'strict', 'readonly'].includes(mode)) {
    if (process.env.NODE_ENV === 'development' && model && field) {
      console.warn(warnings.unknownFieldModeAnnotation(model, field, mode))
    }
  }
  return {
    encrypt: mode !== 'readonly',
    strictDecryption: mode === 'strict'
  }
}

export function parseHashAnnotation(
  annotation = '',
  model?: string,
  field?: string
): HashFieldConfiguration | null {
  const match = annotation.match(hashAnnotationRegex)
  if (!match || !match.groups?.fieldName) {
    return null
  }
  const query = new URLSearchParams(match.groups.query ?? '')
  const inputEncoding = (query.get('inputEncoding') as Encoding) ?? 'utf8'
  if (
    !isValidEncoding(inputEncoding) &&
    process.env.NODE_ENV === 'development' &&
    model &&
    field
  ) {
    console.warn(
      warnings.unsupportedEncoding(model, field, inputEncoding, 'input')
    )
  }
  const outputEncoding = (query.get('outputEncoding') as Encoding) ?? 'hex'
  if (
    !isValidEncoding(outputEncoding) &&
    process.env.NODE_ENV === 'development' &&
    model &&
    field
  ) {
    console.warn(
      warnings.unsupportedEncoding(model, field, outputEncoding, 'output')
    )
  }
  const saltEnv = query.get('saltEnv')
  const salt =
    query.get('salt') ??
    (saltEnv
      ? process.env[saltEnv]
      : process.env.PRISMA_FIELD_ENCRYPTION_HASH_SALT)

  const normalize =
    (query.getAll('normalize') as HashFieldNormalizeOptions[]) ?? []

  if (
    !isValidNormalizeOptions(normalize) &&
    process.env.NODE_ENV === 'development' &&
    model &&
    field
  ) {
    console.warn(warnings.unsupportedNormalize(model, field, normalize))
  }

  if (
    normalize.length > 0 &&
    inputEncoding !== 'utf8' &&
    process.env.NODE_ENV === 'development' &&
    model &&
    field
  ) {
    console.warn(
      warnings.unsupportedNormalizeEncoding(model, field, inputEncoding)
    )
  }

  return {
    sourceField: match.groups.fieldName,
    targetField: field ?? match.groups.fieldName + 'Hash',
    algorithm: query.get('algorithm') ?? 'sha256',
    salt,
    inputEncoding,
    outputEncoding,
    normalize
  }
}

function isValidEncoding(encoding: string): encoding is Encoding {
  return ['hex', 'base64', 'utf8'].includes(encoding)
}

function isValidNormalizeOptions(
  options: string[]
): options is HashFieldNormalizeOptions[] {
  return options.every(option => option in HashFieldNormalizeOptions)
}
