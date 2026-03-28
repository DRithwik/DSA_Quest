from typing import Callable, Any, Dict


def metadata_decorator(function: str, input_desc: str, expected: str):
    """Decorator to attach metadata to test functions for richer test output.

    Renamed to avoid pytest collecting this helper as a test (it previously began with 'test_').
    """

    def decorator(fn: Callable[..., Any]):
        setattr(fn, 'test_meta', {'function': function, 'input': input_desc, 'expected': expected})
        return fn

    return decorator
