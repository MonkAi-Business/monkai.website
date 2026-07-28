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

$sourceNames = @(
  'Clip_1_-_Monkey_working_202607281057.mp4',
  'Monkey_looks_at_laptop_screen_202607281058.mp4',
  'Monkey_opens_door_to_jungle_202607281058.mp4',
  'Monkey_admiring_jungle_view_202607281058.mp4',
  'Monkey_swings_on_vine_202607281058.mp4',
  'Monkey_jumps_to_second_platform_202607281058.mp4',
  'Monkey_crosses_rope_bridge_to_202607281058.mp4'
)

$sources = foreach ($name in $sourceNames) {
  $path = Join-Path $SourceDirectory $name
  if (-not (Test-Path -LiteralPath $path)) {
    throw "Bronvideo ontbreekt: $path"
  }
  $path
}

New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null

$filter = @'
[0:v]trim=duration=8,setpts=PTS-STARTPTS,scale=1280:720:flags=lanczos,fps=24,format=yuv420p[v0];
[1:v]trim=duration=8,setpts=PTS-STARTPTS,scale=1280:720:flags=lanczos,fps=24,format=yuv420p[v1];
[2:v]trim=duration=8,setpts=PTS-STARTPTS,scale=1280:720:flags=lanczos,fps=24,format=yuv420p[v2];
[3:v]trim=duration=10.01,setpts=PTS-STARTPTS,scale=1280:720:flags=lanczos,fps=24,format=yuv420p[v3];
[4:v]trim=duration=9.5,setpts=PTS-STARTPTS,scale=1280:720:flags=lanczos,fps=24,format=yuv420p[v4];
[5:v]trim=duration=8,setpts=PTS-STARTPTS,scale=1280:720:flags=lanczos,fps=24,format=yuv420p[v5];
[6:v]trim=duration=8,setpts=PTS-STARTPTS,scale=1280:720:flags=lanczos,fps=24,format=yuv420p[v6];
[v0][v1]xfade=transition=fade:duration=0.18:offset=7.82[x1];
[x1][v2]xfade=transition=fade:duration=0.18:offset=15.64[x2];
[x2][v3]xfade=transition=fade:duration=0.45:offset=23.19[x3];
[x3][v4]xfade=transition=fade:duration=0.22:offset=32.98[x4];
[x4][v5]xfade=transition=fade:duration=0.22:offset=42.26[x5];
[x5][v6]xfade=transition=fade:duration=0.22:offset=50.04,format=yuv420p[story]
'@ -replace "`r?`n", ''

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
