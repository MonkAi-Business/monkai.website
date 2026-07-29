[CmdletBinding()]
param(
  [string]$SourceDirectory = 'C:\Users\stijn\Downloads',
  [string]$ManifestPath,
  [string]$OutputDirectory,
  [switch]$PlanOnly
)

$ErrorActionPreference = 'Stop'

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$ffmpeg = Join-Path $projectRoot 'node_modules\ffmpeg-static\ffmpeg.exe'
$OutputDirectory = if ($OutputDirectory) {
  [System.IO.Path]::GetFullPath($OutputDirectory)
} else {
  Join-Path $projectRoot 'public\media\scroll-story'
}
$ManifestPath = if ($ManifestPath) {
  [System.IO.Path]::GetFullPath($ManifestPath)
} else {
  Join-Path $PSScriptRoot 'monkey-scenes.json'
}

if (-not $PlanOnly -and -not (Test-Path -LiteralPath $ffmpeg)) {
  throw "FFmpeg ontbreekt op $ffmpeg. Installeer eerst ffmpeg-static."
}

$scenes = Get-Content -Raw -LiteralPath $ManifestPath | ConvertFrom-Json

if ($scenes.Count -lt 1) {
  throw 'Het filmscènemanifest bevat geen scènes.'
}

$sources = foreach ($scene in $scenes) {
  $path = Join-Path $SourceDirectory $scene.file
  if (-not (Test-Path -LiteralPath $path)) {
    throw "Bronvideo ontbreekt: $path"
  }
  $path
}

New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null

$culture = [System.Globalization.CultureInfo]::InvariantCulture
$filterParts = @()
$effectiveDurations = @()

for ($index = 0; $index -lt $scenes.Count; $index += 1) {
  $duration = [double]$scenes[$index].duration
  $trimStart = if ($null -ne $scenes[$index].PSObject.Properties['trimStart']) {
    [double]$scenes[$index].trimStart
  } else {
    0.0
  }
  $trimEnd = if ($null -ne $scenes[$index].PSObject.Properties['trimEnd']) {
    [double]$scenes[$index].trimEnd
  } else {
    $duration
  }

  $invalidRange = [double]::IsNaN($duration) -or
    [double]::IsInfinity($duration) -or
    [double]::IsNaN($trimStart) -or
    [double]::IsInfinity($trimStart) -or
    [double]::IsNaN($trimEnd) -or
    [double]::IsInfinity($trimEnd) -or
    $duration -le 0 -or
    $trimStart -lt 0 -or
    $trimEnd -gt $duration -or
    $trimStart -ge $trimEnd

  if ($invalidRange) {
    throw "Ongeldig knipbereik voor scÃ¨ne '$($scenes[$index].id)': $trimStart tot $trimEnd binnen $duration seconden."
  }

  $trimStartText = $trimStart.ToString('0.######', $culture)
  $trimEndText = $trimEnd.ToString('0.######', $culture)
  $effectiveDurations += $trimEnd - $trimStart
  $filterParts += "[${index}:v]trim=start=$trimStartText`:end=$trimEndText,setpts=PTS-STARTPTS,scale=1280:720:flags=lanczos,fps=24,format=yuv420p[v$index]"
}

$currentLabel = 'v0'
$timeline = [double]$effectiveDurations[0]

for ($index = 1; $index -lt $scenes.Count; $index += 1) {
  $fade = [double]$scenes[$index].transition
  $offset = $timeline - $fade
  $nextLabel = "x$index"
  $fadeText = $fade.ToString('0.##', $culture)
  $offsetText = $offset.ToString('0.##', $culture)
  $filterParts += "[$currentLabel][v$index]xfade=transition=fade:duration=$fadeText`:offset=$offsetText[$nextLabel]"
  $timeline = $timeline + [double]$effectiveDurations[$index] - $fade
  $currentLabel = $nextLabel
}

$filterParts += "[$currentLabel]format=yuv420p[story]"
$filter = $filterParts -join ';'

if ($PlanOnly) {
  [ordered]@{
    filter = $filter
    effectiveDurations = @($effectiveDurations | ForEach-Object {
      [math]::Round([double]$_, 6)
    })
    timeline = [math]::Round($timeline, 6)
  } | ConvertTo-Json -Depth 4
  return
}

$inputArguments = @()
foreach ($source in $sources) {
  $inputArguments += @('-i', $source)
}

$mp4Path = Join-Path $OutputDirectory 'monkai-scroll-story.mp4'
$webmPath = Join-Path $OutputDirectory 'monkai-scroll-story.webm'
$posterPath = Join-Path $OutputDirectory 'monkai-scroll-story-poster.jpg'

$mp4Arguments = @(
  '-hide_banner',
  '-y'
) + $inputArguments + @(
  '-filter_complex', $filter,
  '-map', '[story]',
  '-an',
  '-c:v', 'libx264',
  '-preset', 'medium',
  '-crf', '23',
  '-g', '24',
  '-keyint_min', '24',
  '-sc_threshold', '0',
  '-movflags', '+faststart',
  $mp4Path
)

& $ffmpeg @mp4Arguments
if ($LASTEXITCODE -ne 0) {
  throw "De MP4-encoding is mislukt met exitcode $LASTEXITCODE."
}

$webmArguments = @(
  '-hide_banner',
  '-y'
) + $inputArguments + @(
  '-filter_complex', $filter,
  '-map', '[story]',
  '-an',
  '-c:v', 'libvpx-vp9',
  '-crf', '34',
  '-b:v', '0',
  '-g', '24',
  '-row-mt', '1',
  '-cpu-used', '4',
  $webmPath
)

& $ffmpeg @webmArguments
if ($LASTEXITCODE -ne 0) {
  throw "De WebM-encoding is mislukt met exitcode $LASTEXITCODE."
}

$posterArguments = @(
  '-hide_banner',
  '-y',
  '-ss', '1.5',
  '-i', $mp4Path,
  '-frames:v', '1',
  '-update', '1',
  '-q:v', '2',
  $posterPath
)

& $ffmpeg @posterArguments
if ($LASTEXITCODE -ne 0) {
  throw "Het posterbeeld maken is mislukt met exitcode $LASTEXITCODE."
}

Write-Host "Scrollstory-assets staan in $OutputDirectory"
