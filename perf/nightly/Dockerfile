# The image of the nightly performance run (05): Playwright's own image, so Chromium and its system libraries match
# the @playwright/test version of the repo. run.sh tags it surveyjs-perf:<PW_VERSION>-<sha7 of this file>.
ARG PW_VERSION=1.60.0
FROM mcr.microsoft.com/playwright:v${PW_VERSION}-noble
ARG PW_VERSION
ENV PW_VERSION=${PW_VERSION}
# The state directory is owned by the host user, the container runs as that uid: git must accept it.
RUN git config --system --add safe.directory '*'
