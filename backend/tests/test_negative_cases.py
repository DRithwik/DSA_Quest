import pytest
import json
from test_helpers import metadata_decorator
from backend.parsers import FA_parser
from backend.nodes import FileReader, DirectoryTree
from backend.mongo_store import generate_project_id


@pytest.mark.xfail(reason='Malformed JSON currently causes parser to raise; should be handled gracefully', strict=True)
@metadata_decorator(function='parsers.FA_parser.parse', input_desc='malformed JSON string', expected='parser returns structured error or graceful fallback')
def test_fa_parser_on_malformed_json():
    bad = '{"file_path": "a.py", "file_category": "code file" '  # missing closing }
    # This will raise currently; we mark as xfail
    FA_parser.parse(bad)


@pytest.mark.xfail(reason='FileReader may not handle binary files; currently may return empty or throw', strict=True)
@metadata_decorator(function='nodes.FileReader', input_desc='binary file content', expected='reads or skips cleanly without crash')
def test_filereader_on_binary(tmp_path):
    p = tmp_path / 'binfile'
    p.write_bytes(b"\x00\x01\x02\x03\xff\xfe")
    state = {"root": [{"name": "binfile", "path": str(p), "type": "file", "parent": str(tmp_path)}]}
    out = FileReader(state)
    # Expectation: either content present (decoded) or safely empty; we mark xfail because behavior is not stable
    assert 'content' in out['root'][0]


@pytest.mark.xfail(reason='DirectoryTree may not handle circular parent references; could create infinite loop or inconsistent graph', strict=True)
@metadata_decorator(function='nodes.DirectoryTree', input_desc='flat nodes with circular parent references', expected='handle gracefully or raise clear error')
def test_directory_tree_with_cycle():
    flat = [
        {"name": "a", "path": "/a", "type": "directory", "parent": "/b"},
        {"name": "b", "path": "/b", "type": "directory", "parent": "/a"},
    ]
    state = {"root": flat}
    # DirectoryTree may behave unexpectedly — mark xfail
    DirectoryTree(state)


@pytest.mark.xfail(reason='generate_project_id currently uses json.dumps fallback and will fail on non-serializable objects', strict=True)
@metadata_decorator(function='mongo_store.generate_project_id', input_desc='state containing non-serializable object (set)', expected='handle/set conversion or return stable id')
def test_generate_project_id_with_nonserializable():
    state = {"root": [{"path": "/proj"}], "extra": set([1,2,3])}
    # This will raise TypeError in json.dumps; mark xfail
    generate_project_id(state)


@pytest.mark.xfail(reason='Empty input to FA_parser should be handled; currently may raise', strict=True)
@metadata_decorator(function='parsers.FA_parser.parse', input_desc='empty string', expected='return structured error or empty result')
def test_fa_parser_on_empty_input():
    FA_parser.parse("")


@pytest.mark.xfail(reason='codeFormatter expects string input; non-string should raise', strict=True)
@metadata_decorator(function='codeFormatter.codeFormatter', input_desc='non-string input (None)', expected='TypeError or graceful fallback')
def test_codeformatter_on_nonstring_input():
    from backend import codeFormatter
    codeFormatter.codeFormatter(None)


@pytest.mark.xfail(reason='FileReader called on a directory should raise or skip', strict=True)
@metadata_decorator(function='nodes.FileReader', input_desc='path pointing to a directory', expected='raises or no-op without crash')
def test_filereader_on_directory(tmp_path):
    d = tmp_path / 'somedir'
    d.mkdir()
    state = {"root": [{"name": "somedir", "path": str(d), "type": "file", "parent": str(tmp_path)}]}
    FileReader(state)


@pytest.mark.xfail(reason='Simulate permission error while reading file', strict=True)
@metadata_decorator(function='nodes.FileReader', input_desc='file with no read permission', expected='raise PermissionError or handle gracefully')
def test_filereader_permission_error(tmp_path, monkeypatch):
    p = tmp_path / 'noread.py'
    p.write_text('print(1)')

    # Monkeypatch open to raise PermissionError when attempting to read this file
    import builtins

    real_open = builtins.open

    def fake_open(path, *args, **kwargs):
        if str(path) == str(p):
            raise PermissionError('Permission denied')
        return real_open(path, *args, **kwargs)

    monkeypatch.setattr(builtins, 'open', fake_open)

    state = {"root": [{"name": "noread.py", "path": str(p), "type": "file", "parent": str(tmp_path)}]}
    FileReader(state)
