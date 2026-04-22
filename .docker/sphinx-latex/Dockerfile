FROM ubuntu:24.04

LABEL org.opencontainers.image.source="https://github.com/nextcloud/documentation"
LABEL org.opencontainers.image.description="Sphinx + LaTeX build environment for Nextcloud documentation"
LABEL org.opencontainers.image.licenses="AGPL-3.0"

ENV DEBIAN_FRONTEND=noninteractive
# Allow pip to install packages system-wide inside the container
ENV PIP_BREAK_SYSTEM_PACKAGES=1

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    curl \
    git \
    make \
    python3-pip \
    latexmk \
    tex-gyre \
    texlive-fonts-extra \
    texlive-fonts-extra-links \
    texlive-fonts-recommended \
    texlive-latex-extra \
    texlive-latex-recommended \
    texlive-xetex \
    xindy \
  && mktexlsr \
  && rm -rf /var/lib/apt/lists/*
