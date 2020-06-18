# jest-preset-kyt-enzyme

Jest preset for React projects that use Enzyme to test.

## Installation

```
yarn add --dev jest enzyme jest-preset-kyt-enzyme

// or

npm i --save-dev --save-exact jest enzyme jest-preset-kyt-enzyme
```

## Setup

In your local Jest config - for instance, `jest.config.js`:

```
{
  preset: 'jest-preset-kyt-enzyme'
}
```

Features:

* Automatically installs and configures `enzyme-adapter-react-16`
* Installs and adds `enzyme-to-json/serializer` to `snapshotSerializers`.
* Installs and sets `testEnvironment` to `jest-environment-jsdom-global`, giving you access to the global `jsdom` object in your tests. This is useful if you want to call `jsdom.reconfigure(opts)` in an arbitrary test file.
* Installs and configures `raf/polyfill`, which is required by React 16.
* Automatic `moduleNameMapper` entries/file-stubbing for files with these extensions:
  ```
  css|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|ico|md
  ```
* Sets `cacheDirectory` to `<rootDir>/.caches/jest`, which allows you to build/restore Jest transforms in between CI/CD pipeline runs. Example: using `drone/gcs-cache`:

  ```yaml
  steps:
  - name: restore_cache
    image: homerovalle/drone-gcs-cache:latest
    settings:
      bucket: your-custom-name
      restore: true
    environment:
      GCS_CACHE_JSON_KEY:
        from_secret: a_secret_set_by_you

  - name: test
    image: node:12.16.2
    commands:
    - npm run test-coverage-ci

  - name: rebuild_cache
    image: homerovalle/drone-gcs-cache:latest
    settings:
      bucket: your-custom-name
      mount:
      - .caches
      - coverage
      rebuild: true
    environment:
      GCS_CACHE_JSON_KEY:
        from_secret: a_secret_set_by_you
  ```  
