[CmdletBinding()]
param(
  [string]$SourceDirectory = 'C:\Users\stijn\Downloads'
)

$ErrorActionPreference = 'Stop'

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$ffmpeg = Join-Path $projectRoot 'node_modules\ffmpeg-static\ffmpeg.exe'
$outputDirectory = Join-Path $projectRoot 'public\media\scroll-story'

if (-not (Test-Path -LiteralPath $ffmpeg)) {
  throw "FFmpeg ontbreekt op $ffmpeg. Installeer eerst ffmpeg-static."
}

$manifestPath = Join-Path $PSScriptRoot 'monkey-scenes.json'
$scenes = Get-Content -Raw -LiteralPath $manifestPath | ConvertFrom-Json

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

New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null

$culture = [System.Globalization.CultureInfo]::InvariantCulture
$filterParts = @()

for ($index = 0; $index -lt $scenes.Count; $index += 1) {
  $duration = [double]$scenes[$index].duration
  $durationText = $duration.ToString('0.##', $culture)
  $filterParts += "[${index}:v]trim=duration=$durationText,setpts=PTS-STARTPTS,scale=1280:720:flags=lanczos,fps=24,format=yuv420p[v$index]"
}

$currentLabel = 'v0'
$timeline = [double]$scenes[0].duration

for ($index = 1; $index -lt $scenes.Count; $index += 1) {
  $fade = [double]$scenes[$index].transition
  $offset = $timeline - $fade
  $nextLabel = "x$index"
  $fadeText = $fade.ToString('0.##', $culture)
  $offsetText = $offset.ToString('0.##', $culture)
  $filterParts += "[$currentLabel][v$index]xfade=transition=fade:duration=$fadeText`:offset=$offsetText[$nextLabel]"
  $timeline = $timeline + [double]$scenes[$index].duration - $fade
  $currentLabel = $nextLabel
}

$filterParts += "[$currentLabel]format=yuv420p[story]"
$filter = $filterParts -join ';'

$inputArguments = @()
foreach ($source in $sources) {
  $inputArguments += @('-i', $source)
}

$mp4Path = Join-Path $outputDirectory 'monkai-scroll-story.mp4'
$webmPath = Join-Path $outputDirectory 'monkai-scroll-story.webm'
$posterPath = Join-Path $outputDirectory 'monkai-scroll-story-poster.jpg'

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

Write-Host "Scrollstory-assets staan in $outputDirectory"
