@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Apache Maven Wrapper startup batch script, version 3.3.2
@REM
@REM Optional ENV vars
@REM   JAVA_HOME - location of a JDK home dir, required when download maven via java
@REM   MVNW_REPOURL - repo url base for downloading maven distribution
@REM   MVNW_USERNAME/MVNW_PASSWORD - user and password for downloading maven
@REM   MVNW_VERBOSE - true: enable verbose log; others: silence the output
@REM ----------------------------------------------------------------------------

@IF "%__MVNW_ARG0_NAME__%"=="" (SET __MVNW_ARG0_NAME__=%~nx0)
@SET __MVNW_CMD__=
@SET __MVNW_ERROR__=
@SET __MVNW_PSMODULEP_SAVE=%PSModulePath%
@SET PSModulePath=
@FOR /F "usebackq tokens=1* delims==" %%A IN (`powershell -noprofile "& {$scriptDir='%~dp0'; $script='%__MVNW_ARG0_NAME__%'; icm -ScriptBlock ([Scriptblock]::Create((Get-Content -Raw '%~f0'))) -NoNewScope}"`) DO @(
  IF "%%A"=="__MVNW_CMD__" (set __MVNW_CMD__=%%B)
  IF "%%A"=="__MVNW_ERROR__" (set __MVNW_ERROR__=%%B)
  IF "%%A"=="__MVNW_PSMODULEP_SAVE" (set PSModulePath=%%B)
)
@SET PSModulePath=%__MVNW_PSMODULEP_SAVE%
@SET __MVNW_PSMODULEP_SAVE=
@SET __MVNW_ARG0_NAME__=
@SET MVNW_USERNAME=
@SET MVNW_PASSWORD=
@IF NOT "%__MVNW_CMD__%"=="" (%__MVNW_CMD__% %*)
@IF "%__MVNW_ERROR__%"=="0" (IF ERRORLEVEL 1 @SET __MVNW_ERROR__=%ERRORLEVEL%)
@IF NOT "%__MVNW_ERROR__%"=="0" (EXIT /B %__MVNW_ERROR__%)
@EXIT /B 0

: end batch / begin powershell #>

$ErrorActionPreference = "Stop"
if ($env:MVNW_VERBOSE -eq "true") {
  $VerbosePreference = "Continue"
}

# calculate distributionUrl, requires .mvn/wrapper/maven-wrapper.properties
$distributionUrl = (Get-Content -Raw "$scriptDir/.mvn/wrapper/maven-wrapper.properties" | ConvertFrom-StringData).distributionUrl
if (!$distributionUrl) {
  Write-Error "cannot read distributionUrl property in $scriptDir/.mvn/wrapper/maven-wrapper.properties"
}

switch -wildcard -casesensitive ( $distributionUrl ) {
  "*.tar.gz" {
    $distributionUrlName = $distributionUrl.Substring($distributionUrl.LastIndexOf("/") + 1)
    $distributionUrlNameMain = $distributionUrlName.Substring(0, $distributionUrlName.LastIndexOf(".")).Replace("-bin", "")
    $MVN_CMD = "mvn"
    $repoPattern = "/org/apache/maven/"
  }
  "maven-mvnd-*" {
    $distributionUrlName = $distributionUrl.Substring($distributionUrl.LastIndexOf("/") + 1)
    $distributionUrlNameMain = $distributionUrlName.Substring(0, $distributionUrlName.LastIndexOf(".")).Replace("-bin", "")
    $MVN_CMD = "mvnd.cmd"
    $repoPattern = "/maven/mvnd/"
    switch ( $env:PROCESSOR_ARCHITECTURE ) {
      "AMD64" { $distributionPlatform = "windows-amd64"; Break }
      "x86" { $distributionPlatform = "windows-386"; Break }
      default {
        Write-Error "Cannot detect native platform for mvnd on $env:PROCESSOR_ARCHITECTURE, use pure java version"
        $distributionPlatform = "windows-amd64"
      }
    }
    $distributionUrl = $distributionUrl.Replace("-bin.", "-$distributionPlatform.")
    $distributionUrlName = $distributionUrl.Substring($distributionUrl.LastIndexOf("/") + 1)
    $distributionUrlNameMain = $distributionUrlName.Substring(0, $distributionUrlName.LastIndexOf(".")).Replace("-bin", "")
  }
  default {
    $distributionUrlName = $distributionUrl.Substring($distributionUrl.LastIndexOf("/") + 1)
    $distributionUrlNameMain = $distributionUrlName.Substring(0, $distributionUrlName.LastIndexOf(".")).Replace("-bin", "")
    $MVN_CMD = "mvn.cmd"
    $repoPattern = "/org/apache/maven/"
  }
}

# apply MVNW_REPOURL and calculate MAVEN_HOME
if ($env:MVNW_REPOURL) {
  $distributionUrl = "$env:MVNW_REPOURL$repoPattern$($distributionUrl.Substring($distributionUrl.IndexOf($repoPattern) + $repoPattern.Length))"
}

# maven home pattern: ~/.m2/wrapper/dists/{apache-maven-<version>,maven-mvnd-<version>-<platform>}/<hash>
if ($env:MAVEN_USER_HOME) {
  $MAVEN_USER_HOME = $env:MAVEN_USER_HOME
} else {
  $MAVEN_USER_HOME = "$env:USERPROFILE\.m2"
}
$MAVEN_HOME = "$MAVEN_USER_HOME\wrapper\dists\$distributionUrlNameMain\$($distributionUrl.GetHashCode())"

if (Test-Path -Path "$MAVEN_HOME" -PathType Container) {
  Write-Verbose "found existing MAVEN_HOME at $MAVEN_HOME"
  Write-Output "__MVNW_CMD__=$MAVEN_HOME\bin\$MVN_CMD"
  exit $?
}

if (! $distributionUrl.EndsWith(".zip")) {
  Write-Error "distributionUrl is not valid, must end with .zip, but found $distributionUrl"
}

# prepare tmp dir
$TMP_DOWNLOAD_DIR_HOLDER = New-TemporaryFile
$TMP_DOWNLOAD_DIR = New-Item -Itemtype Directory -Path "$TMP_DOWNLOAD_DIR_HOLDER.dir"
$TMP_DOWNLOAD_DIR_HOLDER.Delete() | Out-Null
trap {
  if ($TMP_DOWNLOAD_DIR.Exists) {
    try { Remove-Item $TMP_DOWNLOAD_DIR -Recurse -Force | Out-Null }
    catch { Write-Warning "Cannot remove $TMP_DOWNLOAD_DIR" }
  }
}

New-Item -Itemtype Directory -Path "$MAVEN_HOME" -Force | Out-Null

# Download and Install Apache Maven
Write-Verbose "Couldn't find MAVEN_HOME, downloading and installing it ..."
Write-Verbose "Downloading from: $distributionUrl"
Write-Verbose "Downloading to: $TMP_DOWNLOAD_DIR\$distributionUrlName"

$webclient = New-Object System.Net.WebClient
if ($env:MVNW_USERNAME -and $env:MVNW_PASSWORD) {
  $webclient.Credentials = New-Object System.Net.NetworkCredential($env:MVNW_USERNAME, $env:MVNW_PASSWORD)
}
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$webclient.DownloadFile($distributionUrl, "$TMP_DOWNLOAD_DIR\$distributionUrlName") | Out-Null

# If specified, validate the SHA-256 sum of the Maven distribution zip file
$distributionSha256Sum = (Get-Content -Raw "$scriptDir/.mvn/wrapper/maven-wrapper.properties" | ConvertFrom-StringData).distributionSha256Sum
if ($distributionSha256Sum) {
  if ($MVN_CMD -eq "mvnd.cmd") {
    Write-Error "Checksum validation is not supported for maven-mvnd. Please disable validation by removing 'distributionSha256Sum' from your maven-wrapper.properties."
  }
  Import-Module $PSHOME\Modules\Microsoft.PowerShell.Utility -Function Get-FileHash
  if ((Get-FileHash "$TMP_DOWNLOAD_DIR\$distributionUrlName" -Algorithm SHA256).Hash.ToLower() -ne $distributionSha256Sum) {
    Write-Error "Error: Failed to validate Maven distribution SHA-256, your Maven distribution might be compromised. If you updated your Maven version, you need to update the specified distributionSha256Sum property."
  }
}

# unzip and move
Expand-Archive "$TMP_DOWNLOAD_DIR\$distributionUrlName" -DestinationPath "$TMP_DOWNLOAD_DIR" | Out-Null
Rename-Item -Path "$TMP_DOWNLOAD_DIR\$distributionUrlNameMain" -NewName $MAVEN_HOME -Force | Out-Null
try {
  Remove-Item $TMP_DOWNLOAD_DIR -Recurse -Force | Out-Null
} catch {
  Write-Warning "Cannot remove $TMP_DOWNLOAD_DIR"
}

Write-Output "__MVNW_CMD__=$MAVEN_HOME\bin\$MVN_CMD"

@REM Made with Bob
