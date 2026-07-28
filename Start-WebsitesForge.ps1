$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

Write-Host "Avvio Websites Forge..."
Write-Host ""

$ForgeUrl = "http://127.0.0.1:4177"

function Test-LocalPortOpen {
  param([int]$Port)

  $Client = New-Object System.Net.Sockets.TcpClient
  try {
    $Result = $Client.BeginConnect("127.0.0.1", $Port, $null, $null)
    if (-not $Result.AsyncWaitHandle.WaitOne(500, $false)) {
      return $false
    }
    $Client.EndConnect($Result)
    return $true
  } catch {
    return $false
  } finally {
    $Client.Close()
  }
}

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
  param([int]$MinimumMajor = 18)

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
    if ((Get-NodeMajorVersion -NodePath $Candidate) -ge $MinimumMajor) {
      return $Candidate
    }
  }

  return $ExistingCandidates | Select-Object -First 1
}

function Update-NodePathEnvironment {
  $MachinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
  $UserPath = [Environment]::GetEnvironmentVariable("Path", "User")
  $NodePath = "$env:ProgramFiles\nodejs"
  $env:Path = @($NodePath, $MachinePath, $UserPath, $env:Path) -join ";"
}

function Install-NodeLts {
  $Winget = Get-Command winget.exe -ErrorAction SilentlyContinue
  if (-not $Winget) {
    Write-Host "Non trovo winget su questo PC."
    Write-Host "Installa Node.js LTS 20 o superiore da https://nodejs.org/it e riapri questo file."
    return $false
  }

  Write-Host "Provo a installare o aggiornare automaticamente Node.js LTS con winget..."
  Write-Host "Se Windows chiede conferma o permessi amministratore, accetta per completare l'installazione."
  & $Winget.Source install --id OpenJS.NodeJS.LTS -e --accept-package-agreements --accept-source-agreements
  if ($LASTEXITCODE -ne 0) {
    Write-Host "Installazione diretta non completata, provo l'aggiornamento del pacchetto LTS..."
    & $Winget.Source upgrade --id OpenJS.NodeJS.LTS -e --accept-package-agreements --accept-source-agreements
  }

  Update-NodePathEnvironment
  return $true
}

$ForgeEnv = Join-Path $Root ".websites-forge-venv"
$env:npm_config_cache = Join-Path $ForgeEnv "npm-cache"
$env:npm_config_prefix = Join-Path $ForgeEnv "npm-global"
$env:npm_config_tmp = Join-Path $ForgeEnv "tmp"
$env:npm_config_update_notifier = "false"
$env:npm_config_audit = "false"
$env:npm_config_fund = "false"

New-Item -ItemType Directory -Force -Path $ForgeEnv, $env:npm_config_cache, $env:npm_config_prefix, $env:npm_config_tmp | Out-Null

$Node = Find-NodeCommand
if (-not $Node) {
  Write-Host "Node.js non risulta installato o non e' nel PATH."
  Install-NodeLts | Out-Null
  $Node = Find-NodeCommand
}

$NodeMajor = if ($Node) { Get-NodeMajorVersion -NodePath $Node } else { 0 }
if ($NodeMajor -lt 18) {
  Write-Host "Node.js installato e' troppo vecchio per Websites Forge."
  if ($Node) {
    Write-Host "Versione trovata: $(& $Node --version)"
  }
  Install-NodeLts | Out-Null
  $Node = Find-NodeCommand
  $NodeMajor = if ($Node) { Get-NodeMajorVersion -NodePath $Node } else { 0 }
}

if (-not $Node -or $NodeMajor -lt 18) {
  Write-Host ""
  Write-Host "Non riesco ancora a usare Node.js LTS 20 o superiore."
  Write-Host "Riavvia Windows e rilancia Avvia Websites Forge.bat."
  Write-Host "Se resta bloccato sulla versione vecchia, disinstalla Node.js 14 da App e funzionalita' e rilancia questo file."
  exit 1
}

Write-Host "Node.js OK: $(& $Node --version)"

$NodeDir = Split-Path -Parent $Node
$NpmCliCandidates = @(
  (Join-Path $NodeDir "node_modules\npm\bin\npm-cli.js"),
  (Join-Path (Split-Path -Parent $NodeDir) "nodejs\node_modules\npm\bin\npm-cli.js"),
  "$env:APPDATA\npm\node_modules\npm\bin\npm-cli.js"
)
$NpmCli = $NpmCliCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $NpmCli) {
  Write-Host "ERRORE: npm-cli.js non trovato accanto a Node.js."
  Write-Host "Reinstalla Node.js LTS includendo npm."
  exit 1
}

$TsxCli = Join-Path $Root "node_modules\tsx\dist\cli.mjs"
$ReactTypes = Join-Path $Root "node_modules\@types\react\index.d.ts"
$ReactDomTypes = Join-Path $Root "node_modules\@types\react-dom\index.d.ts"
$NeedsInstall = (-not (Test-Path $TsxCli)) -or (-not (Test-Path $ReactTypes)) -or (-not (Test-Path $ReactDomTypes))

if ($NeedsInstall) {
  Write-Host "Creo/aggiorno l'ambiente locale del progetto in .websites-forge-venv."
  Write-Host "Le dipendenze vengono installate solo in questa cartella progetto, non nel sistema."
  & $Node $NpmCli install --no-audit --no-fund
  if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERRORE: installazione dipendenze non riuscita."
    exit $LASTEXITCODE
  }
}

if (-not (Test-Path $TsxCli)) {
  Write-Host "ERRORE: tsx non trovato dopo l'installazione."
  exit 1
}

if ((-not (Test-Path $ReactTypes)) -or (-not (Test-Path $ReactDomTypes))) {
  Write-Host "ERRORE: tipi React non trovati dopo l'installazione."
  exit 1
}

if (Test-LocalPortOpen -Port 4177) {
  Write-Host "Websites Forge risulta gia' avviato su 127.0.0.1:4177."
  Write-Host "Apro l'editor esistente senza avviare un secondo server."
  Start-Process $ForgeUrl
  exit 0
}

$RunnerScript = Join-Path $Root "Run-WebsitesForgeServer.ps1"
Start-Process powershell.exe -ArgumentList @("-NoProfile", "-ExecutionPolicy", "Bypass", "-NoExit", "-File", $RunnerScript) -WorkingDirectory $Root

Start-Sleep -Seconds 3
Start-Process $ForgeUrl
