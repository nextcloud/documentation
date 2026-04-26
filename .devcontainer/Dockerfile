FROM python:3.13

LABEL org.opencontainers.image.source="https://github.com/nextcloud/documentation"
LABEL org.opencontainers.image.description="Sphinx build environment for Nextcloud documentation"
LABEL org.opencontainers.image.licenses="AGPL-3.0"

USER root

# Add dev tools needed for building
RUN export DEBIAN_FRONTEND=noninteractive \
    && apt-get update \
    && apt-get -y install --no-install-recommends \
        ca-certificates curl gnupg2 git lsb-release nano make \
        graphviz imagemagick inkscape sass unzip wget \
        php-cli npm \
        latexmk texlive-fonts-extra texlive-fonts-extra-links texlive-fonts-recommended \
        texlive-latex-extra texlive-latex-recommended tex-gyre texlive-xetex xindy \
    && mktexlsr \
    && wget https://getcomposer.org/installer -qO /tmp/composer-setup.php \
    && php /tmp/composer-setup.php \
    && mv composer.phar /usr/local/bin/composer \
    && npm install svgexport -g \
    && rm -f /tmp/composer-setup.php \
    && rm -rf /var/lib/apt/lists/*

# Allow pip to install packages system-wide inside the container when running
# as root (avoids PEP 668 "externally managed environment" error)
RUN printf '[global]\nbreak-system-packages = true\n' > /etc/pip.conf
