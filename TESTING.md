Testing instructions and detailed test explanations
===============================================

This document explains how the tests were created, how to run them, and a detailed explanation for each test case added to the project.

Prerequisites
-------------
- Python 3.11+ (used here: Python 3.13)
- Node 18+ to run frontend tests (optional)
- Recommended: a virtual environment for Python and a node package manager (npm/yarn/pnpm)

Quick commands
--------------
- Install backend deps and pytest:

```powershell
cd "c:\major project\backend"
python -m pip install -r requirements.txt
python -m pip install pytest
cd ..
python -m pytest -q
```

- Run tests verbosely (to collect per-test output):

```powershell
python -m pytest -q -vv
```

- Frontend unit tests (Vitest):

```powershell
npm install
npm run test:unit
```

Files added / changed
---------------------
- `pytest.ini` — pytest config (test discovery under `backend/tests`).
- `backend/tests/test_api_server.py` — Flask `app.test_client()` health endpoint test.
- `backend/tests/test_mongo_store.py` — tests for `generate_project_id`.
- `backend/tests/test_nodes_functions.py` — 18 tests covering `nodes.py` utilities and behaviors.
- `src/lib/__tests__/utils.test.ts` — simple Vitest test for `cn` utility.
- `vitest.config.ts` — vitest configuration.
- `package.json` updated with `test:unit` script and dev deps for Vitest.
- `test.txt` — raw pytest verbose output saved here.

Test rationale and detailed per-test explanations
------------------------------------------------
The tests are intentionally lightweight and deterministic. They avoid external calls to the LLM and MongoDB by testing pure functions and local filesystem manipulations.

1) backend/tests/test_api_server.py::test_health_check
   - Purpose: Verify that the Flask app `/api/health` endpoint returns a structured healthy response.
   - How: Uses `app.test_client()` to GET `/api/health` and asserts HTTP 200 and JSON payload with `status: "healthy"`.

2) backend/tests/test_mongo_store.py::test_generate_project_id_from_path
   - Purpose: Validate stable project-id generation from a root path.
   - How: Uses pytest `tmp_path` to create a directory, passes it as `state['root'][0]['path']` and compares output to the SHA256 of the normalized path.

3) backend/tests/test_mongo_store.py::test_generate_project_id_fallback
   - Purpose: Validate fallback hashing when no root path exists.
   - How: Pass a minimal dict and assert returned id is a 64-character hex string.

4–21) backend/tests/test_nodes_functions.py (18 tests)
   - These tests cover the following functions and behaviors in `backend/nodes.py` and related helpers:
     - `clean_code`: verify blank-line removal and indentation preservation for indentation-oriented languages and proper stripping for other languages.
     - `is_indentation_oriented`: verify correct detection for `.py`, `.java`, and `Makefile`.
     - `DirectoryTree`: converts a flat `state['root']` into a `directory_graph` hierarchical structure (handles single and multiple roots).
     - `JunkCleaner`: removes paths in `state['remove']` from `root` and `to_visit`.
     - `read_file` and `FileReader`: reads files into `state['root'][*]['content']` with appropriate cleaning.
     - `codeFormatter`: smoke test that it returns expected content (round-trip check).
     - `DEO_parser` and `FA_parser` (parsers): check `get_format_instructions()` returns non-empty strings and that `FA_parser.parse` can parse a valid FileAnalysis JSON payload.
     - `list_files_node`: ensure directory listing populates `state['root']` with discovered files and directories.

   - Approach: Each test creates a minimal, deterministic scenario (often using `tmp_path`) and asserts results in `state` objects rather than performing network calls.

Why these tests
----------------
- Coverage: The tests focus on core local logic used during analysis (file listing, content cleaning, building directory trees, and parsing outputs). These are the parts we can reliably test in isolation.
- Safety: No dependence on network, LLM, or DB. This keeps tests stable and fast in CI.

Test output
-----------
- The raw, verbose pytest run was saved to `test.txt` (this file contains the per-test PASS lines and the summary `21 passed`).

Next recommended steps
----------------------
1. Implement integration tests for `mongo_store.store_state` using either a test MongoDB (docker-compose or test container) or a mocked `pymongo` client.
2. Add component tests for the frontend using `@testing-library/react` (AnalysisRunner, PreviousRuns, AnalyticsDashboard) and snapshots where useful.
3. Implement SSE `/api/analyze/stream` if you want live progress to match the frontend EventSource usage.
4. Add GitHub Actions CI to run `pytest` and `vitest` on PRs.

Status
------
- Tests were added and executed locally in this environment. All backend tests passed (21/21). A raw test log is available in `test.txt`.

If you want, I can follow up by adding frontend component tests, implementing the SSE endpoint, or adding CI configuration next. Tell me which you prefer.
Testing instructions
====================

This project has basic test scaffolding for both the backend (Python) and the frontend (TypeScript/Vite).

Prerequisites
-------------
- Python 3.11+
- Node 18+ and npm/yarn/pnpm
- For backend tests: install dev dependencies `pip install -r backend/requirements.txt` (and pytest)
- For frontend tests: install node dependencies with `npm install` or `pnpm install`

Running backend tests
---------------------
From the repository root:

```powershell
python -m pip install pytest
pytest -q
```

Running frontend unit tests (Vitest)
-----------------------------------
Install node deps then run:

```powershell
npm install
npm run test:unit
```

Notes
-----
- Backend tests are lightweight and do not require MongoDB or the LLM API.
- Frontend unit tests use Vitest with a jsdom environment.
