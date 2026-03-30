FROM php:8.3-cli AS composer_deps

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    unzip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

ENV APP_ENV=showcase

COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --prefer-dist \
    --optimize-autoloader \
    --no-scripts

COPY . .
RUN cp -n .env.example .env || true \
    && mkdir -p bootstrap/cache \
    && composer dump-autoload --optimize --no-dev --classmap-authoritative

FROM php:8.3-cli AS frontend_builder

ARG NODE_VERSION=20.19.0

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    xz-utils \
    libsqlite3-dev \
    && docker-php-ext-install pdo_sqlite \
    && curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz" -o /tmp/node.tar.xz \
    && tar -xJf /tmp/node.tar.xz -C /usr/local --strip-components=1 --no-same-owner \
    && rm -f /tmp/node.tar.xz \
    && apt-get purge -y --auto-remove curl xz-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

COPY package.json package-lock.json ./
RUN npm install --no-audit --no-fund

COPY --from=composer_deps /var/www/html /var/www/html
RUN printf 'APP_KEY=base64:SHOWCASE_KEY_PLACEHOLDER_NOT_FOR_PRODUCTION\nAPP_ENV=showcase\nDB_CONNECTION=sqlite\nDB_DATABASE=/tmp/build.sqlite\n' > .env \
    && touch /tmp/build.sqlite \
    && mkdir -p storage/framework/views storage/framework/cache storage/framework/sessions bootstrap/cache \
    && php artisan migrate --force --quiet || true \
    && php artisan wayfinder:generate --with-form \
    && npm run build

FROM php:8.3-apache

ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
ENV PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers

RUN apt-get update && apt-get install -y --no-install-recommends \
    libicu-dev \
    libzip-dev \
    unzip \
    python3 \
    python3-venv \
    python3-pip \
    libnss3 \
    libatk-bridge2.0-0 \
    libxkbcommon0 \
    libgtk-3-0 \
    libasound2 \
    libxshmfence1 \
    libgbm1 \
    libdrm2 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libpango-1.0-0 \
    libcairo2 \
    libatspi2.0-0 \
    libx11-xcb1 \
    libxcb1 \
    libxext6 \
    libx11-6 \
    fonts-liberation \
    && docker-php-ext-install pdo_mysql intl bcmath opcache zip \
    && a2enmod rewrite \
    && sed -ri -e "s!/var/www/html!${APACHE_DOCUMENT_ROOT}!g" /etc/apache2/sites-available/*.conf /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

COPY --from=composer_deps /var/www/html /var/www/html
COPY --from=frontend_builder /var/www/html/public/build /var/www/html/public/build

RUN cp -n .env.example .env || true \
    && python3 -m venv /var/www/html/external/orion-ai/.venv \
    && /var/www/html/external/orion-ai/.venv/bin/pip install --upgrade pip \
    && /var/www/html/external/orion-ai/.venv/bin/pip install -r /var/www/html/external/orion-ai/requirements.txt \
    && PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers /var/www/html/external/orion-ai/.venv/bin/python -m playwright install chromium \
    && touch database/database.sqlite \
    && mkdir -p external/orion-ai/memory \
    && mkdir -p external/orion-ai/logs \
    && touch external/orion-ai/logs/orion.log \
    && mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache database external/orion-ai/memory external/orion-ai/logs \
    && chmod -R ug+rwX storage bootstrap/cache database external/orion-ai/memory external/orion-ai/logs \
    && chmod -R o+rX public/images public/orion-face

EXPOSE 80
