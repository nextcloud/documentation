FROM python:3.9 as final

USER root

# Add dev tools needed for building
RUN export DEBIAN_FRONTEND=noninteractive \
    && apt-get update \
    && apt-get -y install --no-install-recommends \
        curl gnupg2 git nano make graphviz imagemagick inkscape sass unzip wget php-cli npm latexmk texlive-latex-extra tex-gyre \
    && wget https://getcomposer.org/installer -qO /tmp/composer-setup.php \
    && php /tmp/composer-setup.php \
    && mv composer.phar /usr/local/bin/composer \
    && npm install svgexport -g \
    && rm -f /tmp/composer-setup.php \
    && rm -rf /var/lib/apt/lists/*