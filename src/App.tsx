import { ChakraProvider, Container, Box, Flex } from '@chakra-ui/react';

import { Navbar } from './components/Navbar';
import { BuyingZone } from './buyingZone/BuyingZone';
import { SponsorsBlock } from './SponsorBlock/SponsorBlock'; 
import { RulesBlock } from './rulesBlock/RulesBlock';
import { SupportBlock} from './supportBlock/supportBlock';
import { ServerOnlineBlock } from './serverOnlineBlock/serverOnlineBlock';
import { Footer } from './components/Footer';

import theme from './theme';
import './dayssansblack.css';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box position="fixed" top={0} left={0} right={0} bottom={0} zIndex={-1} />
      
      <Container 
        minW="100%" minH="100dvh" centerContent p={0} position="relative" zIndex={1} bgGradient="linear(to-b, #192c3f, #071019)"
      >
        <Navbar />
        
        {/* Chakra UI сама выстроит их в колонку на base и в строку на xl */}
        <Flex
          w="full"
          maxW={{ xl: "1300px", base: "370px" }}
          direction={{ base: "column", xl: "row" }}
          justifyContent="space-between"
          gap={{ base: 4, xl: 0 }} // Добавляем отступ, чтобы на телефоне блоки не слиплись
                transition="all 0.45s ease-out"

        >
          <Box flex="1" display="flex" w="full" maxW={{xl: "643px", base: "370px"}}>
            <BuyingZone />
          </Box>

          <Box display={{ base: "none", xl: "flex" }} w="full" maxW={{xl: "643px", base: "370px"}}>
            <SponsorsBlock />
          </Box>
        </Flex>

        <ServerOnlineBlock />
        <RulesBlock />
        {/* <SupportBlock /> */}

        <Footer/>
      </Container>
    </ChakraProvider>
  );
}

export default App;