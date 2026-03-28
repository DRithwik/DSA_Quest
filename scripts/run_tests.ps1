<#
.SYNOPSIS
Run backend (pytest) and frontend (Vitest) tests on Windows PowerShell.

.PARAMETER Mode
Which tests to run: 'backend', 'frontend', or 'all' (default 'all').

.PARAMETER Watch
If set, run frontend Vitest in watch mode.

.PARAMETER SaveReport
Path to save pytest output (will write the raw pytest stdout).

.EXAMPLE
.
\scripts\run_tests.ps1 -Mode backend -SaveReport .\detailed_run.txt
#>
param(
    [ValidateSet('backend','frontend','all')]
    [string]$Mode = 'all',

    [switch]$Watch,

    [string]$SaveReport = ''
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent $PSScriptRoot
Push-Location $Root

function Run-Pytest {
    Write-Host "Running backend tests (pytest)..." -ForegroundColor Cyan
    try {
        if ($SaveReport) {
            # Run and tee output to file - use PowerShell's Tee-Object
            & python -m pytest -q -vv -s | Tee-Object -FilePath $SaveReport
        }
        else {
            & python -m pytest -q -vv -s
        }
    }
    catch {
        Write-Error "Pytest failed to run: $_"
        throw
    }
}

function Run-Vitest {
    Write-Host "Running frontend tests (vitest)..." -ForegroundColor Cyan
    # Check if npx is available
    $npxCmd = Get-Command npx -ErrorAction SilentlyContinue
    if (-not $npxCmd) {
        Write-Warning "npx (Node.js) is not available in PATH. Install Node.js and run npm install in the project root. Skipping frontend tests."
        return
    }

    # Check if node_modules exists; if not, suggest npm install
    if (-not (Test-Path -Path (Join-Path $Root 'node_modules'))) {
        Write-Warning "node_modules not found. Run npm install in $Root to install frontend dependencies. Attempting to run npx anyway."
    }

    try {
        if ($Watch) {
            & npx vitest --watch
        }
        else {
            & npx vitest run
        }
    }
    catch {
        Write-Warning "Frontend tests failed to run with npx/vitest: $_"
        Write-Host "Common fixes:"
    Write-Host " - Ensure Node.js and npm are installed and available in PATH: https://nodejs.org/"
    Write-Host " - Run npm install in the project root to populate node_modules"
    Write-Host " - If npm is misconfigured, try reinstalling Node.js or clearing npm cache: npm cache clean --force"
        Write-Host "Skipping frontend tests due to the above error."
        return
    }
}

switch ($Mode) {
    'backend' { Run-Pytest }
    'frontend' { Run-Vitest }
    'all' { Run-Pytest; Run-Vitest }
}

Pop-Location
Write-Host "Done." -ForegroundColor Green
