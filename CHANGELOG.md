# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this
project adheres to [Semantic Versioning](http://semver.org/).

## [1.0.3] - 2026-02-06

### Fixed

- Auto-login with OTP when opening the pop-up to manage whiteboards.
- Close form and prompts when the user is disconnected from the conference.
- Avoid showing a toast message indicating that the whiteboard is selected and
  undefined when the user closes the form.

## [1.0.2] - 2025-06-03

### Changed

- Update dependencies.
- Document sandbox values in the README file.

### Fixed

- Convert projectId from number to string to avoid problems with the Collaboard
  API and the select inputs.

## [1.0.1] - 2025-05-08

### Added

- Refresh token.
- Create a one-time-token when opening the popup.

### Changed

- Change invitation link from `/acceptProjectInvitation` to `/share`.

### Fixed

- Icon colors.

### Security

- Update dependencies to fix vulnerabilities.

## [1.0.0] - 2024-11-14

### Added

- First version of the plugin for Collaboard.
