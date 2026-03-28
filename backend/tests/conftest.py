import pytest


def pytest_runtest_setup(item):
    meta = getattr(item.function, 'test_meta', None)
    if meta:
        print('\n--- TEST METADATA ---')
        print(f"File: {item.fspath}")
        print(f"Function under test: {meta.get('function')}")
        print(f"Input: {meta.get('input')}")
        print(f"Expected: {meta.get('expected')}")
        print('---------------------')


def pytest_runtest_makereport(item, call):
    # Called when test phase (setup/call/teardown) finishes. We only care about call phase.
    if call.when != 'call':
        return

    meta = getattr(item.function, 'test_meta', None)
    if not meta:
        return

    if call.excinfo is None:
        actual = 'PASSED'
        details = ''
    else:
        actual = 'FAILED'
        # extract exception message
        details = str(call.excinfo.value)

    print('\n--- TEST RESULT ---')
    print(f"Actual: {actual}")
    if details:
        print(f"Details: {details}")
    print('-------------------')
