import json
import os
from textwrap import wrap


def load_report(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def print_summary(summary):
    print("\nTest Summary")
    print("-----------")
    print(f"Total: {summary.get('total')}")
    print(f"Passed: {summary.get('passed')}")
    print(f"Failed: {summary.get('failed')}")
    print(f"Duration (s): {summary.get('duration_sec')}")


def print_table(tests):
    print("\nDetailed Tests")
    print("--------------")
    # header
    print(f"{'#':>3}  {'Status':8}  {'Test Name':40}  {'File':30}")
    print('-' * 100)
    for t in tests:
        id = t.get('id')
        status = t.get('status')
        name = t.get('name')[:40]
        file = os.path.basename(t.get('file'))[:30]
        print(f"{id:3}  {status:8}  {name:40}  {file:30}")


def print_details(tests):
    print("\nPer-test details")
    print("----------------")
    for t in tests:
        print(f"\n{t['id']}. {t['name']}")
        print(f"   File: {t['file']}")
        print(f"   Purpose: {t['purpose']}")
        print(f"   Expected: {t['expected']}")
        print(f"   Actual: {t['actual']}")
        print(f"   Status: {t['status']}")


def main():
    repo_root = os.path.dirname(os.path.dirname(__file__))
    json_path = os.path.join(repo_root, 'detailed_test_report.json')
    if not os.path.exists(json_path):
        print('Report not found:', json_path)
        return
    report = load_report(json_path)
    print_summary(report.get('summary', {}))
    print_table(report.get('tests', []))
    print_details(report.get('tests', []))


if __name__ == '__main__':
    main()
