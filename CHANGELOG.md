# 📝 Changelog

All notable changes to the OpenPrep AI project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]
### Added
- Spaced Repetition engine logic for Flashcards (`SuperMemo SM-2` adaptation).
- Redux slices for global user auth state and request handling.
- PDF and text processing pipelines in Express backend.

### Fixed
- Intermittent CORS issues when connecting Vite local server to Node.js backend.
- Token expiration handling inside the Redux Thunk loader.

---

## [0.5.0] - 2026-06-21
### Added
- Initialize Vite, React, and Tailwind CSS frontend boilerplate.
- Establish Node.js, Express, and MongoDB backend.
- Design mongoose schemas for Users, Exams, Subjects, Topics, Study Plans, Quizzes, Flashcards, and Activity Logs.
- Setup Docker configurations for local development and Docker Compose file.
- Configure GitHub actions for automated linting and validation.
- Create complete developer documentation system (`docs/`).
