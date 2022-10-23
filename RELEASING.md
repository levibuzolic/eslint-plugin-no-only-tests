Releasing is handled by GitHub Actions and is powered by GitHub Releases.

 1. Set the new version following the [semver](https://semver.org/) specification in `package.json`
 2. Verify the package contents and size using `npm publish --dry-run`
 3. [Draft a new release](https://github.com/levibuzolic/eslint-plugin-no-only-tests/releases/new)
    * Set the tag version to the new version
    * Set the release title to the new version
    * Auto-generate the release notes, excluding any internal changes
 4. [Watch the release build](https://github.com/levibuzolic/eslint-plugin-no-only-tests/actions/workflows/publish.yml) and verify it completes successfully
