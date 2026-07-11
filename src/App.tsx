import { ChakraProvider, Container, Box} from '@chakra-ui/react';

import { Navbar } from './components/Navbar';
import { BuyingZone } from './buyingZone/BuyingZone';
import { RulesBlock } from './rulesBlock/RulesBlock';

import theme from './theme';
import './dayssansblack.css';

function App() {
  return (
    <ChakraProvider theme = {theme}>
      {/* Навигационная панель */}
      {/* <Navbar /> */}
      <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={-1}
      />

      <Container minW="100%" minH="100dvh" centerContent p={0} position="relative" zIndex={1} bgGradient="linear(to-b, #264059, #0d1a26)"

>
        <Navbar />

        {/* Основной контент страницы */}
        <BuyingZone />
        <RulesBlock />
      </Container>
    </ChakraProvider>
  );
}

export default App;