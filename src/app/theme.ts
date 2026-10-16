import type { ThemeConfig } from 'antd'

// Шрифты подключаются в index.html (Google Fonts, с кириллицей).
// Onest — основной текст интерфейса, Unbounded — заголовки и крупные числа (см. index.css).
const FONT_TEXT =
  "'Onest', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"

// Фиолетовый акцент. Контраст с белым ≈ 5.7:1 — подходит и для ссылок, и для текста на кнопках.
const VIOLET = '#7c3aed'

export const theme: ThemeConfig = {
  token: {
    colorPrimary: VIOLET,
    colorInfo: VIOLET,
    colorLink: VIOLET,
    // Фон страниц с лёгким фиолетовым оттенком, карточки остаются белыми.
    colorBgLayout: '#f6f4fb',
    fontFamily: FONT_TEXT,
    borderRadius: 8,
  },
  components: {
    // Иконки сайдбара (Lucide) — 18px, в том числе в свёрнутом меню.
    Menu: {
      iconSize: 18,
      collapsedIconSize: 18,
    },
  },
}
