# Todo App (Nuxt 4)

[![Nuxt](https://img.shields.io/badge/Nuxt-4.6.4-00DC82?logo=nuxt.js&logoColor=white)](https://nuxt.com/)
[![Vue](https://img.shields.io/badge/Vue-3.5.45-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Pinia](https://img.shields.io/badge/Pinia-4.1.0-FFD859?logo=pinia&logoColor=black)](https://pinia.vuejs.org/)
[![Sass](https://img.shields.io/badge/Sass-1.108.2-CC6699?logo=sass&logoColor=white)](https://sass-lang.com/)

**Todo App** — это современное приложение для управления задачами, разработанное на Nuxt 4 с использованием Pinia для управления состоянием и поддержкой темной/светлой темы.

---

## 🚀 Живая демонстрация

Посмотреть работающее приложение можно здесь:
👉 **[https://trane2025.github.io/todo/](https://trane2025.github.io/todo/)**

> _Примечание: Демо-версия собрана как статический сайт (SSG) и размещена на GitHub Pages._

---

## 🛠️ Технологический стек

- **Фреймворк:** [Nuxt 4](https://nuxt.com/) (Vue 3)
- **Управление состоянием:** [Pinia](https://pinia.vuejs.org/) (`@pinia/nuxt`)
- **Стилизация:** [Sass](https://sass-lang.com/) / Scoped Styles
- **Форматирование:** [Prettier](https://prettier.io/)
- **Язык:** TypeScript
- **Деплой:** GitHub Pages (через GitHub Actions)
- **Контейнеризация:** Docker & Docker Compose

---

## 📦 Установка и запуск

Клонируйте репозиторий и откройте папку проекта.

```bash
git clone https://github.com/trane2025/todo.git
cd todo
```

### Запуск через Docker

С установленным Docker Compose выполните команду в папке проекта.

```bash
docker compose up --build
```

Откройте [http://127.0.0.1:3000](http://127.0.0.1:3000).

### Локальный запуск с Node.js

Для локального запуска рекомендуется Node.js 24 начиная с версии 24.15.0.

```bash
npm ci
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

### Unit-тесты

После установки зависимостей запустите тесты стора и истории изменений.

```bash
npm test
```
