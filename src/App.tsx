import { ChakraProvider, Container, Box} from '@chakra-ui/react';

import { Navbar } from './components/Navbar';
import { BuyingZone } from './buyingZone/BuyingZone';
import { RulesBlock } from './rulesBlock/RulesBlock';

import theme from './theme';
import './dayssansblack.css';

function App() {
  return (
    <ChakraProvider theme = {theme}>
      {/* Основной контент страницы */}
      <Navbar />

      <Container minW="100%" centerContent bgGradient = "linear(to-tr, #005959, #284159)">
             {/* Навигационная панель */}
              <BuyingZone />
              <RulesBlock />
      </Container>
    </ChakraProvider>
  );
}

export default App;