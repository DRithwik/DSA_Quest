import json
import hashlib
from backend.mongo_store import generate_project_id
from test_helpers import metadata_decorator


@metadata_decorator(function='mongo_store.generate_project_id', input_desc='state with root[0].path set to a temp dir', expected='SHA256 hex of normalized path')
def test_generate_project_id_from_path(tmp_path):
    # create a fake state with root path
    p = tmp_path / "proj"
    p.mkdir()
    state = {"root": [{"path": str(p)}]}
    pid = generate_project_id(state)
    # SHA256 of normalized path
    expected = hashlib.sha256(str(p).strip().lower().encode("utf-8")).hexdigest()
    assert pid == expected


@metadata_decorator(function='mongo_store.generate_project_id', input_desc='state without root path', expected='SHA256 hex of JSON state string')
def test_generate_project_id_fallback():
    state = {"foo": "bar"}
    pid = generate_project_id(state)
    # should be a 64-char hex string
    assert isinstance(pid, str) and len(pid) == 64
