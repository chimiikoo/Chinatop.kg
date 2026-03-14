# Настройка VPS для запуска Node.js сайта (Ubuntu 22.04 / 24.04)

Поздравляю с переходом на VPS! Это профессиональное решение.
Когда вы купите VPS, хостер пришлет вам письмо с данными доступа:
*   **IP-адрес** (например, `45.12.34.56`)
*   **Пользователь** (обычно `root`)
*   **Пароль** (длинный и сложный)

Вот пошаговая инструкция, что будем делать дальше.

## Шаг 1: Подключение к серверу
Вам понадобится терминал. В Windows можно использовать обычный PowerShell или командную строку (cmd).

1.  Откройте терминал на своем компьютере.
2.  Введите команду (замените цифры на свой IP):
    ```powershell
    ssh root@ваш_ip_адрес
    ```
3.  На вопрос `Are you sure you want to continue connecting?` напишите `yes` и нажмите Enter.
4.  Введите пароль (когда печатаете, символы **не отображаются** — это нормально, просто введите и нажмите Enter).

## Шаг 2: Установка Node.js и сервера

Скопируйте и вставьте эти команды по одной в терминал сервера:

1.  **Обновляем систему:**
    ```bash
    apt update && apt upgrade -y
    ```

2.  **Устанавливаем Node.js (версия 20):**
    ```bash
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    ```

3.  **Проверяем установку:**
    ```bash
    node -v
    npm -v
    ```
    *(Должно показать v20.x.x)*

4.  **Устанавливаем PM2 (чтобы сайт работал вечно):**
    ```bash
    npm install -g pm2
    ```

## Шаг 3: Загрузка файлов на сервер
Мы будем использовать протокол SCP (или SFTP) для передачи файлов.

1.  **На вашем компьютере** (не на сервере!) откройте новый терминал в папке проекта.
2.  Убедитесь, что у вас есть архив `site.zip` (папка `dist` + `package.json` + `pnpm-lock.yaml`).
3.  Отправьте архив на сервер:
    ```powershell
    scp site.zip root@ваш_ip_адрес:/root/
    ```

## Шаг 4: Запуск сайта на сервере

Вернитесь в терминал, где вы подключены к серверу.

1.  **Распакуйте архив:**
    ```bash
    apt install unzip
    unzip site.zip -d chinatop
    cd chinatop
    ```

2.  **Установите зависимости:**
    ```bash
    npm install --production
    ```

3.  **Запустите сайт через PM2:**
    ```bash
    pm2 start dist/index.js --name "chinatop"
    pm2 save
    pm2 startup
    ```

Теперь ваш сайт работает на порту 5000! Но чтобы он открывался по домену (без :5000), нужно настроить Nginx.

## Шаг 5: Настройка домена (Nginx)

1.  **Установите Nginx:**
    ```bash
    apt install nginx -y
    ```

2.  **Создайте конфиг сайта:**
    ```bash
    nano /etc/nginx/sites-available/chinatop
    ```

3.  **Вставьте туда этот код** (замените `chinatopp.com` на ваш домен):
    ```nginx
    server {
        listen 80;
        server_name chinatopp.com www.chinatopp.com;

        location / {
            proxy_pass http://localhost:5000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```
    *Нажмите `Ctrl+X`, затем `Y`, затем `Enter`, чтобы сохранить.*

4.  **Активируйте сайт:**
    ```bash
    ln -s /etc/nginx/sites-available/chinatop /etc/nginx/sites-enabled/
    nginx -t
    systemctl restart nginx
    ```

## Шаг 6: SSL сертификат (HTTPS)

Чтобы был замочек 🔒:

```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d chinatopp.com -d www.chinatopp.com
```

(Вас попросят ввести email и согласиться с условиями — введите `Y`).

---
**Готово!** Ваш сайт доступен по адресу `https://chinatopp.com`.
