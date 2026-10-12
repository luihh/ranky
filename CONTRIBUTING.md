# Contributing to Ranky

Thanks for your interest in contributing to Ranky! Whether you're fixing a typo, reporting a bug, or building a new feature, your help is appreciated.

Please read this guide before opening your first issue or pull request.

## Table of contents

- [Ways to contribute](#ways-to-contribute)
- [Reporting bugs](#reporting-bugs)
- [Suggesting features](#suggesting-features)
- [Setting up the project locally](#setting-up-the-project-locally)
- [Making changes](#making-changes)
- [Pull request process](#pull-request-process)
- [License](#license)
- [Code of conduct](#code-of-conduct)

## Ways to contribute

- **Report bugs** you run into while using Ranky
- **Suggest features** or improvements
- **Improve documentation**, including fixing typos and clarifying instructions
- **Submit code** to fix bugs or implement features

## Reporting bugs

Before opening a new issue, please search the existing issues to see if it has already been reported.

When you open a bug report, include:

- A clear, descriptive title
- Steps to reproduce the problem
- What you expected to happen, and what actually happened
- Your environment (browser, operating system or any other relevant information)
- Screenshots or error messages, if you have them

**Security issues:** please do not report security vulnerabilities in public issues. Contact the maintainer privately at **luihh@proton.me** instead.

## Suggesting features

Feature ideas are welcome. Open an issue and describe:

- The problem you're trying to solve
- Your proposed solution
- Any alternatives you considered

For larger features, please **open an issue and discuss it first** before writing code. This avoids wasted effort if the idea doesn't fit the direction of the project.

## Setting up the project locally

1. **Fork** the repository on GitHub.
2. **Clone** your fork:

   ```bash
   git clone https://github.com/luihh/ranky.git
   cd ranky
   ```

3. **Install dependencies:**

   ```bash
   pnpm install
   ```

4. **Run the project locally:**

   ```bash
   pnpm run dev
   ```
<!--
5. **Run the tests** (if the project has them):

   ```bash
   pnpm run test
   ```
-->

## Making changes

1. Create a new branch from `main`. Use a descriptive name.
2. Make your changes, keeping them focused. One pull request should do one thing.
3. Follow the existing code style. If the project has a linter or formatter, run it before committing:

   ```bash
   pnpm run lint
   ```

4. Add or update tests for your changes where it makes sense.
5. Update the documentation if your change affects how Ranky is used.
6. Write clear commit messages that explain what changed and why.

## Pull request process

1. Push your branch to your fork and open a pull request against `main`.
2. Fill in the pull request description: what you changed, why, and how to test it. Link any related issue (for example, `Closes #123`).
3. **Sign the CLA** if you haven't already (see below). Your pull request can't be merged until it's signed.
4. Wait for review. The maintainer may ask for changes. Please be patient, as this is a small project.
5. Once approved and all checks pass, the maintainer will merge your pull request.

Pull requests may be declined if they don't fit the project's direction, but you will always get an explanation.

## License

Ranky is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**. See the [LICENSE](LICENSE) file for the full text.

By contributing to Ranky, you agree that your contributions will be licensed under the AGPL-3.0, subject to the terms of the CLA described above.

## Code of conduct

Be respectful and constructive. Harassment, discrimination, personal attacks, and trolling are not tolerated. The maintainer may remove comments, close issues, or block users who violate this.

---

Thank you for helping make Ranky better!
