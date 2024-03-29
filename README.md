# Case

[<img alt="npm" src="https://img.shields.io/npm/v/@juici/case?style=for-the-badge" height="20">](https://www.npmjs.com/package/@juici/case)
[<img alt="build status" src="https://img.shields.io/github/workflow/status/Juici/case.js/Node%20CI/master?style=for-the-badge&logo=github" height="20">](https://github.com/Juici/case.js/actions?query=branch%3Amaster)

This library exists to provide case conversion between common cases like
camelCase and snake_case, with type-level support. It is intended to be unicode
aware, internally consistent, and reasonably well performing.

The transformation algorithm in this library is based on the Rust [heck] library.

[heck]: https://github.com/withoutboats/heck

## Cases contained in this library

1. PascalCase
2. camelCase
3. snake_case
4. kebab-case

## License

This project is licensed under either of [Apache License, Version 2.0](LICENSE-APACHE)
or [MIT License](LICENSE-MIT) at your option.

### Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in the work by you, as defined in the Apache-2.0 license, shall be
dual licensed as above, without any additional terms or conditions.
