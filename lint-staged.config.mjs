const lintStagedConfig = {
  '*.{json,mjs,cjs,js,ts}': (stagedFiles) => [`prettier --loglevel warn --cache --write ${stagedFiles.join(' ')}`],

  'src/**/*.{ts,tsx,js}': (stagedFiles) => [
    `prettier --loglevel warn --cache --write ${stagedFiles.join(' ')}`,
    `eslint --cache --cache-location ./node_modules/.cache/.eslintcache --fix ${stagedFiles.join(' ')}`,
  ],
}

export default lintStagedConfig
