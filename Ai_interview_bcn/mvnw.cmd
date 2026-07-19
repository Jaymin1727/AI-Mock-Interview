@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF)
@REM Maven Wrapper startup batch script
@REM ----------------------------------------------------------------------------
@IF "%__MVNW_ARG0_NAME__%"=="" (SET "__MVNW_ARG0_NAME__=%~nx0")
@SET __ = 
@SET "MVN_CMD=mvn"
@SET "MVNW_REPOURL=https://repo.maven.apache.org/maven2"

@SET "MVNW_DOWNLOAD_FROM_SOURCE="
@SET "MVNW_VERBOSE="

@FOR /F "usebackq tokens=1,2 delims==" %%A IN ("%~dp0.mvn\wrapper\maven-wrapper.properties") DO (
    @IF "%%A"=="distributionUrl" SET "DISTRIBUTION_URL=%%B"
)

@SET "MVNW_DIR=%USERPROFILE%\.m2\wrapper\dists"
@SET "MVN_HOME=%MVNW_DIR%\apache-maven-3.9.6"

@IF EXIST "%MVN_HOME%\bin\mvn.cmd" (
    SET "MVN_CMD=%MVN_HOME%\bin\mvn.cmd"
    GOTO run
)

@ECHO Downloading Maven Wrapper...
@MKDIR "%MVN_HOME%" 2>NUL
@powershell -Command "Invoke-WebRequest -Uri '%DISTRIBUTION_URL%' -OutFile '%TEMP%\maven.zip'; Expand-Archive -Path '%TEMP%\maven.zip' -DestinationPath '%MVNW_DIR%' -Force"

:run
@"%MVN_CMD%" %*
