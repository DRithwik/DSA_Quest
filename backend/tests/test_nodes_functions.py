import os
import json
import hashlib
import tempfile
from pathlib import Path

import pytest

from backend.mongo_store import generate_project_id
from backend.nodes import (
    clean_code,
    is_indentation_oriented,
    DirectoryTree,
    JunkCleaner,
    FileReader,
    list_files_node,
    read_file,
)
from backend.codeFormatter import codeFormatter
from backend.parsers import DEO_parser, FA_parser, FileAnalysis
from test_helpers import metadata_decorator


@metadata_decorator(function='mongo_store.generate_project_id', input_desc='state with root[0].path=temp dir', expected='SHA256 hex of normalized path')
def test_generate_project_id_from_path(tmp_path):
    p = tmp_path / "proj"
    p.mkdir()
    state = {"root": [{"path": str(p)}]}
    pid = generate_project_id(state)
    expected = hashlib.sha256(str(p).strip().lower().encode("utf-8")).hexdigest()
    assert pid == expected


@metadata_decorator(function='mongo_store.generate_project_id', input_desc='state without root path', expected='64-char hex string')
def test_generate_project_id_fallback():
    state = {"foo": "bar"}
    pid = generate_project_id(state)
    assert isinstance(pid, str) and len(pid) == 64


@metadata_decorator(function='nodes.clean_code', input_desc='python code with blank lines', expected='no double blank lines, preserve indentation')
def test_clean_code_indentation_true():
    src = "def f():\n    x = 1    \n\n    y = 2\n"
    out = clean_code(src, indentation_oriented=True)
    assert "\n\n" not in out
    assert out.splitlines()[1].endswith("1")


@metadata_decorator(function='nodes.clean_code', input_desc='java code with indentation', expected='strip leading indentation')
def test_clean_code_indentation_false():
    src = "    public void f() {\n        return;\n    }\n"
    out = clean_code(src, indentation_oriented=False)
    assert not out.startswith(" ")


@metadata_decorator(function='nodes.is_indentation_oriented', input_desc='filename: script.py', expected='True')
def test_is_indentation_oriented_py():
    assert is_indentation_oriented("script.py") is True


@metadata_decorator(function='nodes.is_indentation_oriented', input_desc='filename: Main.java', expected='False')
def test_is_indentation_oriented_java():
    assert is_indentation_oriented("Main.java") is False


@metadata_decorator(function='nodes.is_indentation_oriented', input_desc='filename: Makefile', expected='True')
def test_is_indentation_oriented_makefile():
    assert is_indentation_oriented("Makefile") is True


@metadata_decorator(function='nodes.DirectoryTree', input_desc='flat root list with parent pointers', expected='directory_graph hierarchical structure')
def test_directory_tree_builds_hierarchy():
    # flat nodes with parent pointers
    flat = [
        {"name": "proj", "path": "/proj", "type": "directory", "parent": None},
        {"name": "src", "path": "/proj/src", "type": "directory", "parent": "/proj"},
        {"name": "main.py", "path": "/proj/src/main.py", "type": "file", "parent": "/proj/src"},
    ]
    state = {"root": flat}
    new = DirectoryTree(state)
    dg = new.get("directory_graph")
    assert dg is not None
    assert dg["name"] == "proj"
    assert isinstance(dg["children"], list)


@metadata_decorator(function='nodes.DirectoryTree', input_desc='flat root list with multiple roots', expected='no crash, directory_graph present')
def test_directory_tree_multiple_roots():
    flat = [
        {"name": "a", "path": "/a", "type": "directory", "parent": None},
        {"name": "b", "path": "/b", "type": "directory", "parent": None},
    ]
    state = {"root": flat}
    new = DirectoryTree(state)
    assert new.get("directory_graph") is not None


@metadata_decorator(function='nodes.JunkCleaner', input_desc='state with remove list including /a/venv', expected='remove venv from root and to_visit')
def test_junk_cleaner_removes_paths():
    state = {
        "root": [
            {"name": "a", "path": "/a", "type": "directory", "parent": None},
            {"name": "venv", "path": "/a/venv", "type": "directory", "parent": "/a"},
        ],
        "to_visit": [{"parent": "/a", "children": ["/a/venv"]}],
        "current_path": {"parent": None, "children": ["/a"]},
        "remove": ["/a/venv"],
    }
    out = JunkCleaner(state)
    paths = [n["path"] for n in out["root"]]
    assert "/a/venv" not in paths


@metadata_decorator(function='nodes.JunkCleaner', input_desc='state with empty remove list', expected='no changes to root')
def test_junk_cleaner_noop_when_empty():
    state = {"root": [], "to_visit": [], "current_path": {"parent": None, "children": []}, "remove": []}
    out = JunkCleaner(state)
    assert out["root"] == []


@metadata_decorator(function='nodes.FileReader', input_desc='temp python file on disk', expected='state.root[*].content populated')
def test_read_file_and_filereader(tmp_path):
    d = tmp_path / "p"
    d.mkdir()
    f = d / "a.py"
    f.write_text("def f():\n    return 1\n")
    state = {"root": [{"name": "a.py", "path": str(f), "type": "file", "parent": str(d)}]}
    out = FileReader(state)
    assert "content" in out["root"][0]
    assert "def f()" in out["root"][0]["content"]


@metadata_decorator(function='nodes.FileReader', input_desc='temp java file on disk', expected='content starts with non-indented code')
def test_filereader_non_indentation(tmp_path):
    d = tmp_path / "p2"
    d.mkdir()
    f = d / "a.java"
    f.write_text("    public class A {\n        void m(){}\n    }\n")
    state = {"root": [{"name": "a.java", "path": str(f), "type": "file", "parent": str(d)}]}
    out = FileReader(state)
    assert out["root"][0]["content"].startswith("public class")


@metadata_decorator(function='codeFormatter.codeFormatter', input_desc='string code', expected='returns formatted string containing input')
def test_code_formatter_roundtrip(tmp_path):
    s = "print('hello')"
    out = codeFormatter(s)
    assert isinstance(out, str)
    assert "hello" in out


@metadata_decorator(function='parsers.DEO_parser & FA_parser', input_desc='none', expected='non-empty format instructions strings')
def test_parsers_get_instructions():
    ins = DEO_parser.get_format_instructions()
    assert isinstance(ins, str) and len(ins) > 0
    ins2 = FA_parser.get_format_instructions()
    assert isinstance(ins2, str) and len(ins2) > 0


@metadata_decorator(function='parsers.FA_parser.parse', input_desc='valid FileAnalysis JSON', expected='parsed model with correct file_path')
def test_fa_parser_parses_valid_fileanalysis():
    payload = {
        "file_path": "a.py",
        "file_category": "code file",
        "use_of_file": "example",
        "technical_requirements": [],
        "documentation": "doc",
        "dependencies": {},
        "issues": [],
        "basic_improvements": [],
        "fix": "fixed code"
    }
    txt = json.dumps(payload)
    parsed: FileAnalysis = FA_parser.parse(txt)
    assert parsed.file_path == "a.py"


@metadata_decorator(function='nodes.list_files_node', input_desc='temp dir with file and subdir', expected='state.root contains file and directory entries')
def test_list_files_node_creates_entries(tmp_path):
    # create directory with file and subdir
    root = tmp_path / "root"
    root.mkdir()
    sub = root / "sub"
    sub.mkdir()
    f = root / "x.txt"
    f.write_text("hello")

    state = {
        "current_path": {"parent": None, "children": [str(root)]},
        "root": [],
        "to_visit": [],
    }
    out = list_files_node(state)
    paths = [item["path"] for item in out["root"]]
    assert str(f) in paths
    assert str(sub) in paths


@metadata_decorator(function='nodes.clean_code', input_desc='python code multiline', expected='indentation preserved in cleaned output')
def test_clean_code_preserves_indentation_for_python():
    src = "def f():\n    x = 1\n    y = 2\n"
    out = clean_code(src, indentation_oriented=True)
    assert out.count("    ") >= 2
