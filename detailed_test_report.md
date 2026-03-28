# Detailed Test Report

Latest pytest run summary (generated):

- Total tests: 29
- Passed: 21
- Failed: 5
- XFailed (expected failures): 3
- Duration: ~1.83s

## Failed tests

1. backend/tests/test_negative_cases.py::test_filereader_on_binary
   - Function: nodes.FileReader
   - Input: binary file content
   - Expected: reads or skips cleanly without crash
   - Details: FileReader logged a UnicodeDecodeError when attempting to read a binary file; code swallowed the error and continued. Marked strict xfail -> reported as failure.

2. backend/tests/test_negative_cases.py::test_directory_tree_with_cycle
   - Function: nodes.DirectoryTree
   - Input: flat nodes with circular parent references
   - Expected: handle gracefully or raise clear error
   - Details: DirectoryTree built a directory_graph (XPASS). Test is strict xfail, so treated as a failure.

3. backend/tests/test_negative_cases.py::test_generate_project_id_with_nonserializable
   - Function: mongo_store.generate_project_id
   - Input: state with non-serializable object (set)
   - Expected: fail or explicit conversion
   - Details: generate_project_id already sanitizes sets -> returned stable id (XPASS -> failure under strict xfail).

4. backend/tests/test_negative_cases.py::test_filereader_on_directory
   - Function: nodes.FileReader
   - Input: path pointing to a directory
   - Expected: raises or no-op without crash
   - Details: FileReader logged PermissionError when reading directory but continued (XPASS -> failed under strict xfail).

5. backend/tests/test_negative_cases.py::test_filereader_permission_error
   - Function: nodes.FileReader
   - Input: file with no read permission
   - Expected: raise PermissionError or handle gracefully
   - Details: FileReader encountered PermissionError but test was strict xfail -> failure when it XPASSed.

## XFailed (expected failures)

- backend/tests/test_negative_cases.py::test_fa_parser_on_malformed_json
- backend/tests/test_negative_cases.py::test_fa_parser_on_empty_input
- backend/tests/test_negative_cases.py::test_codeformatter_on_nonstring_input

## Notes and recommended next steps

- If you expect the current behavior (FileReader silently logs errors and continues), convert the strict xfail tests into normal passing tests that assert the observed behavior.
- If you want to keep these as enforced failures, tighten the tests to force the documented invalid behavior or keep strict xfail to make XPASS a CI failure.
Detailed Test Report
====================

Run command: python -m pytest -q -vv --showlocals
Summary: 21 tests executed, 21 passed, 0 failed

Numbered test breakdown (name, purpose, expected output, actual output)

1. test_health_check (backend/tests/test_api_server.py)
   - Purpose: Verify `/api/health` returns status "healthy".
   - Expected output: HTTP 200 and JSON {"status": "healthy", "message": "API server is running"}
   - Actual output: PASSED (endpoint returned healthy as asserted)

2. test_generate_project_id_from_path (backend/tests/test_mongo_store.py)
   - Purpose: Ensure `generate_project_id` computes SHA256 of normalized root path.
   - Expected output: 64-char hex SHA256 of the path
   - Actual output: PASSED (function returned expected SHA256)

3. test_generate_project_id_fallback (backend/tests/test_mongo_store.py)
   - Purpose: Ensure stable fallback id when no path present.
   - Expected output: 64-char hex SHA256 of JSON state
   - Actual output: PASSED (returned 64-char hex string)

4. test_generate_project_id_from_path (backend/tests/test_nodes_functions.py)
   - Purpose: duplicate coverage for `generate_project_id` via nodes tests
   - Expected output: same stable SHA256
   - Actual output: PASSED

5. test_generate_project_id_fallback (backend/tests/test_nodes_functions.py)
   - Purpose: duplicate fallback coverage
   - Expected output: 64-char hex
   - Actual output: PASSED

6. test_clean_code_indentation_true
   - Purpose: verify `clean_code` retains indentation, removes blank lines for Python-like input
   - Expected output: cleaned string without consecutive blank lines and preserved leading indentation for code lines
   - Actual output: PASSED

7. test_clean_code_indentation_false
   - Purpose: verify `clean_code` strips leading whitespace for non-indentation languages
   - Expected output: cleaned string starting with non-space characters
   - Actual output: PASSED

8. test_is_indentation_oriented_py
   - Purpose: check `.py` returns True
   - Expected output: True
   - Actual output: PASSED

9. test_is_indentation_oriented_java
   - Purpose: check `.java` returns False
   - Expected output: False
   - Actual output: PASSED

10. test_is_indentation_oriented_makefile
    - Purpose: check `Makefile` returns True
    - Expected output: True
    - Actual output: PASSED

11. test_directory_tree_builds_hierarchy
    - Purpose: ensure `DirectoryTree` builds hierarchical `directory_graph` from flat nodes
    - Expected output: `directory_graph` present with proper children attachments
    - Actual output: PASSED

12. test_directory_tree_multiple_roots
    - Purpose: ensure multiple-root scenarios handled (no crash)
    - Expected output: `directory_graph` is set (one of the roots)
    - Actual output: PASSED

13. test_junk_cleaner_removes_paths
    - Purpose: JunkCleaner filters `state['remove']` paths out of `root` and `to_visit`
    - Expected output: junk paths not present in `root` or `current_path.children`
    - Actual output: PASSED

14. test_junk_cleaner_noop_when_empty
    - Purpose: ensure no-op when `remove` is empty
    - Expected output: state unchanged
    - Actual output: PASSED

15. test_read_file_and_filereader
    - Purpose: FileReader reads files and populates `content` in state
    - Expected output: `state['root'][0]['content']` contains file text
    - Actual output: PASSED

16. test_filereader_non_indentation
    - Purpose: FileReader cleans non-indentation files by stripping leading indentation
    - Expected output: content lines start without excessive leading spaces
    - Actual output: PASSED

17. test_code_formatter_roundtrip
    - Purpose: codeFormatter returns content back (no crash)
    - Expected output: returned string contains input text
    - Actual output: PASSED

18. test_parsers_get_instructions
    - Purpose: Ensure DEO_parser and FA_parser provide format instructions
    - Expected output: non-empty instructions strings
    - Actual output: PASSED

19. test_fa_parser_parses_valid_fileanalysis
    - Purpose: FA_parser can parse a correct FileAnalysis JSON into Pydantic model
    - Expected output: parsed model with `file_path` equal to provided
    - Actual output: PASSED

20. test_list_files_node_creates_entries
    - Purpose: list_files_node enumerates filesystem entries and appends them to state['root']
    - Expected output: discovered file and subdirectory present in `state['root']`
    - Actual output: PASSED

21. test_clean_code_preserves_indentation_for_python
    - Purpose: ensure indentation preserved in cleaned Python code
    - Expected output: cleaned string contains indentation spaces for nested lines
    - Actual output: PASSED

End of report.
