import { 
  ChakraProvider, 
  Container, 
  Box, 
  Flex 
} from '@chakra-ui/react';

import { Navbar } from './components/Navbar';
import { BuyingZone } from './modules/BuyingZone/BuyingZone';
import { SponsorsBlock } from './modules/SponsorBlock/SponsorBlock'; 
import { RulesBlock } from './modules/RulesBlock/RulesBlock';
// import { SupportBlock } from './modules/SupportBlock/SupportBlock';
import { ServerOnlineBlock } from './modules/ServerOnlineBlock/ServerOnlineBlock';
import { Footer } from './components/Footer';

import theme from './theme';
import './assets/dayssansblack.css';

function App() {
  return (
    <ChakraProvider theme={theme}>
      {/* ФОНОВОЕ ПОКРЫТИЕ */}
      <Box 
        position="fixed" 
        top={0} 
        left={0} 
        right={0} 
        bottom={0} 
        zIndex={-1} 
      />
      
      {/* ГЛАВНЫЙ КОНТЕЙНЕР ПРИЛОЖЕНИЯ */}
      <Container 
        minW="100%" 
        minH="100dvh" 
        centerContent 
        p={0} 
        position="relative" 
        zIndex={1} 
        bgGradient="linear(to-b, #192c3f, #071019)"
      >
        <Navbar />
        
        {/* 
          ВЕРХНИЙ РЯД БЛОКОВ 
          Chakra UI сама выстроит их в колонку на телефонах и в строку на ПК 
        */}
        <Flex
          w="full"
          maxW={{ xl: "1300px", base: "370px" }}
          direction={{ base: "column", xl: "row" }}
          justifyContent="space-between"
          transition="all 0.45s ease-out"
        >
          {/* ЛЕВАЯ КОЛОНКА: Зона покупки */}
          <Box 
            flex="1" 
            display="flex" 
            w="full" 
            maxW={{ xl: "635px", base: "370px" }}
          >
            <BuyingZone />
          </Box>

          {/* ПРАВАЯ КОЛОНКА: Спонсоры (Скрыты на мобильных устройствах) */}
          <Box 
            display={{ base: "none", xl: "flex" }} 
            w="full" 
            maxW={{ xl: "635px", base: "370px" }}
          >
            <SponsorsBlock />
          </Box>
        </Flex>

        {/* ОСТАЛЬНЫЕ БЛОКИ */}
        <ServerOnlineBlock />
        <RulesBlock />
        {/* <SupportBlock /> */}
        
        <Footer />
      </Container>
    </ChakraProvider>
  );
}

export default App;