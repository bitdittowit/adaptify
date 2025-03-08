import fs from 'node:fs';
import path from 'node:path';

import { getRequestConfig } from 'next-intl/server';

import { getUserLocale } from '@/services/locale';

export default getRequestConfig(async () => {
    const locale = await getUserLocale();

    // Используем динамический импорт для загрузки локализаций
    let messages;
    try {
        // Пробуем первый способ импорта
        messages = (await import(`../../public/locales/${locale}.json`)).default;
    } catch (err) {
        // Если динамический импорт не работает, читаем файл напрямую из файловой системы
        console.error('Ошибка при загрузке локализаций через импорт:', err);
        try {
            const filePath = path.join(process.cwd(), 'public', 'locales', `${locale}.json`);
            const fileContents = fs.readFileSync(filePath, 'utf8');
            messages = JSON.parse(fileContents);
        } catch (fsErr) {
            console.error('Ошибка при чтении файла локализаций с диска:', fsErr);
            // Простая заглушка на случай, если файл не найден
            messages = {};
        }
    }

    return {
        locale,
        messages,
    };
});
