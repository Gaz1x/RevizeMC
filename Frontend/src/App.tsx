import { ChakraProvider, Container, Box, Flex } from "@chakra-ui/react";

import { Navbar } from "./components/Navbar";
import { TokenBlock } from "./modules/TokenBlock/TokenBlock";
import { LatestBlock } from "./modules/LatestBlock/LatestBlock";
import { SocialBlock } from "./modules/SocialBlock/SocialBlock";
import { MediaBlock } from "./modules/MediaBlock/MediaBlock";
import { ServerBlock } from "./modules/ServerBlock/ServerBlock";
import { Footer } from "./components/Footer";
import { Credits } from "./components/Credits";

import theme from "./theme";
import "./assets/dayssansblack.css";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box position="fixed" top={0} left={0} right={0} bottom={0} zIndex={-1} />

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

        <Flex
          w="full"
          maxW={{ base: "370px", xl: "1300px" }}
          direction="column"
        >
          <Box w="full" order={{ xl: "2", base: "1" }}>
            <ServerBlock />
          </Box>

          <Flex
            w="full"
            direction={{ base: "column", xl: "row" }}
            justifyContent="space-between"
            transition="all 0.45s ease-out"
            order={{ xl: "1", base: "2" }}
          >
            <Box
              flex="1"
              display="flex"
              w="full"
              maxW={{ base: "370px", xl: "635px" }}
            >
              <TokenBlock />
            </Box>

            <Box display={{ base: "none", xl: "flex" }} w="full" maxW="635px">
              <LatestBlock />
            </Box>
          </Flex>
        </Flex>
        <Flex
          w="full"
          maxW={{ base: "370px", xl: "1300px" }}
          direction={{ base: "column", xl: "row" }}
          justifyContent="space-between"
          transition="all 0.45s ease-out"
        >
          <SocialBlock />
          <MediaBlock />
        </Flex>

        <Footer />
        <Credits />
      </Container>
    </ChakraProvider>
  );
}

export default App;
