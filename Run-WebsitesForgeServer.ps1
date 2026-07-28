$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

$ForgeEnv = Join-Path $Root ".websites-forge-venv"
$env:npm_config_cache = Join-Path $ForgeEnv "npm-cache"
$env:npm_config_prefix = Join-Path $ForgeEnv "npm-global"
$env:npm_config_tmp = Join-Path $ForgeEnv "tmp"
$env:npm_config_update_notifier = "false"
$env:npm_config_audit = "false"
$env:npm_config_fund = "false"

function Get-NodeMajorVersion {
  param([string]$NodePath)

  $VersionText = & $NodePath --version
  if ($LASTEXITCODE -ne 0) {
    return 0
  }

  $VersionText = $VersionText.Trim().TrimStart("v")
  $Major = 0
  [void][int]::TryParse(($VersionText -split "\.")[0], [ref]$Major)
  return $Major
}

function Find-NodeCommand {
  $Candidates = @()
  $Candidates += Get-Command node.exe -All -ErrorAction SilentlyContinue | ForEach-Object { $_.Source }
  $Candidates += @(
    "$env:ProgramFiles\nodejs\node.exe",
    "${env:ProgramFiles(x86)}\nodejs\node.exe",
    "$env:LOCALAPPDATA\Programs\nodejs\node.exe"
  )

  $ExistingCandidates = $Candidates |
    Where-Object { $_ -and (Test-Path $_) } |
    Select-Object -Unique

  foreach ($Candidate in $ExistingCandidates) {
    if ((Get-NodeMajorVersion -NodePath $Candidate) -ge 18) {
      return $Candidate
    }
  }

  return $ExistingCandidates | Select-Object -First 1
}

$Node = Find-NodeCommand
if (-not $Node) {
  Write-Host "Node.js non risulta installato."
  Write-Host "Chiudi questa finestra e rilancia Avvia Websites Forge.bat: ti guidera' nell'installazione automatica."
  exit 1
}

$NodeVersion = (& $Node --version).Trim()
$NodeMajor = 0
[void][int]::TryParse((($NodeVersion.TrimStart("v")) -split "\.")[0], [ref]$NodeMajor)
if ($NodeMajor -lt 18) {
  Write-Host "Node.js installato e' troppo vecchio per Websites Forge."
  Write-Host "Versione trovata: $NodeVersion"
  Write-Host "Chiudi questa finestra e rilancia Avvia Websites Forge.bat: ti guidera' nell'aggiornamento automatico."
  exit 1
}

$TsxCli = Join-Path $Root "node_modules\tsx\dist\cli.mjs"
$ServerScript = Join-Path $Root "server\websites-forge.ts"

& $Node $TsxCli $ServerScript
