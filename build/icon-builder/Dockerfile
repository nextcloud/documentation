FROM php:7

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        npm git sudo \
        libnss3 libxss1 libasound2 libx11-xcb1 libxcb-dri3-0 libxcomposite1 \
        libxcursor1 libxdamage1 libxi6 libxtst6 libatk1.0-0 libatk-bridge2.0-0 \
        libcups2 libxrandr2 libdrm2 libgbm1 libpangocairo-1.0-0 libgtk-3-0 && \
    apt-get clean && \
    npm install -g svgexport

# Install composer
RUN curl https://raw.githubusercontent.com/composer/getcomposer.org/main/web/installer -qL | php -- --quiet && \
    mv composer.phar /usr/local/bin/composer

COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
