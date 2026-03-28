def codeFormatter(code: str) ->str:
    s = code
    with open('formatted_code.txt', 'w', encoding='utf-8') as f:
        f.write(s)
    with open('formatted_code.txt', 'r', encoding='utf-8') as f:
        return f.read()