import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: `'DaysSansBlackDesign', sans-serif`,
    body: `'DaysSansBlackDesign', sans-serif`,
  },
  styles: {
    global: {
      'html': {
        // Устанавливаем базовый цвет для самого верха и низа окна (убирает белые полосы при скролле)
        backgroundColor: '#122130', 
      },
      'body': {
        // Делаем фон прозрачным, так как основной градиент находится в App.tsx
        backgroundColor: 'transparent',
      },
      
      // Браузер будет применять Caps ТОЛЬКО к вводимому тексту
      'input.chakra-input, textarea.chakra-textarea': {
        fontFamily: `'DaysSansBlackCaps', sans-serif !important`,
      },

      // Браузер принудительно переключит шрифт на Design, ТОЛЬКО когда виден placeholder
      'input.chakra-input::placeholder, textarea.chakra-textarea::placeholder': {
        fontFamily: `'DaysSansBlackDesign', sans-serif !important`,
      },
      
      // Дублируем для Webkit-движков (Safari, мобильный Chrome)
      'input.chakra-input::-webkit-input-placeholder, textarea.chakra-textarea::-webkit-input-placeholder': {
        fontFamily: `'DaysSansBlackDesign', sans-serif !important`,
      }
    },
  },
});

export default theme;