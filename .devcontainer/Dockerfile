FROM ubuntu:24.04

LABEL org.opencontainers.image.source="https://github.com/nextcloud/documentation"
LABEL org.opencontainers.image.description="Sphinx build environment for Nextcloud documentation"
LABEL org.opencontainers.image.licenses="AGPL-3.0"

USER root

# Add dev tools needed for building
RUN export DEBIAN_FRONTEND=noninteractive \
    && apt-get update \
    && apt-get -y install --no-install-recommends \
        ca-certificates curl gnupg2 git lsb-release nano make \
        unzip wget \
        python3 python3-pip python3-venv \
        latexmk texlive-fonts-extra texlive-fonts-extra-links texlive-fonts-recommended \
        texlive-latex-extra texlive-latex-recommended tex-gyre texlive-xetex xindy \
    && mktexlsr \
    && rm -rf /var/lib/apt/lists/*

# Allow pip to install packages system-wide inside the container when running
# as root (avoids PEP 668 "externally managed environment" error)
RUN printf '[global]\nbreak-system-packages = true\n' > /etc/pip.conf
