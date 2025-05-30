import { FlatCompat } from '@eslint/eslintrc'
import reactHooksPlugin from 'eslint-plugin-react-hooks'

import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next', 'next/typescript', 'prettier'),

  {
    plugins: {
      'react-hooks': reactHooksPlugin,
    },

    rules: {
      // Common
      curly: ['error', 'all'],
      'no-new': 'off',
      'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
      'no-irregular-whitespace': ['error', { skipTemplates: true, skipStrings: true }],
      'no-restricted-syntax': [
        'error',
        {
          selector: '[object.type=MetaProperty][property.name=env]',
          message: 'Use instead import { env } from "lib/env"',
        },
      ],

      // Import order
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: ['external', 'internal', 'parent', 'sibling', 'index'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
            orderImportKind: 'asc',
          },
        },
      ],

      // TS
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/consistent-type-assertions': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
]

export default eslintConfig
