import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: `'DaysSansBlackDesign', sans-serif`,
    body: `'DaysSansBlackDesign', sans-serif`,
  },

  styles: {
      global: {
        'html': {
          // Устанавливаем базовый цвет для самого верха и низа окна (убирает белые полосы)
          backgroundColor: '#1a2e42', 
        },
        'body': {
          // Прописываем градиент в синтаксисе стандартного CSS (to top right)
          background: '!important',
          // backgroundAttachment: 'fixed !important', // Фиксируем его, чтобы он не двигался при скролле
          // margin: '0',
          // padding: '0',
          // minHeight: '100dvh',
          // WebkitOverflowScrolling: 'touch',
        },

        // Браузер будет применять Caps ТОЛЬКО к вводимому тексту
        'input.chakra-input, textarea.chakra-textarea': {
          fontFamily: `'DaysSansBlackCaps', sans-serif !important`,
        },

        // Браузер принудительно переключит шрифт на Design, ТОЛЬКО когда виден placeholder
        'input.chakra-input::placeholder, textarea.chakra-textarea::placeholder': {
          fontFamily: `'DaysSansBlackDesign', sans-serif !important`,
        },
        
        // Дублируем для Webkit-движков (Safari, Chrome на телефонах)
        'input.chakra-input::-webkit-input-placeholder, textarea.chakra-textarea::-webkit-input-placeholder': {
          fontFamily: `'DaysSansBlackDesign', sans-serif !important`,
        }
      },
    },

});

export default theme;