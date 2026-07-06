import { ChakraProvider, Container} from '@chakra-ui/react';
import { Navbar } from './components/Navbar';
import theme from './theme';
import './dayssansblack.css';

function App() {
  return (
    <ChakraProvider theme = {theme}>
      {/* Основной контент страницы */}
      <Container minW="100vw" minH="100vh" pt="100px" centerContent bgGradient = "linear(to-tr, #005959, #284159)">
              {/* Навигационная панель */}
              <Navbar />
      </Container>
    </ChakraProvider>
  );
}

export default App;