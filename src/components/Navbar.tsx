import { Tooltip, Image, Box, Text, VStack, HStack, Container, useClipboard } from '@chakra-ui/react';
import { useState } from 'react';
import logo from "./images/blueLogo.png";

export const Navbar = () => {
  const { onCopy } = useClipboard("revizemc.net");
  
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setIsCopied(true);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setIsCopied(false);
    }, 200);
  };

  return (
    <Container
      as="nav"
      position="fixed"
      top="2"
      left="0"
      right="0"
      zIndex="sticky"
      bg="whiteAlpha.50"
      backdropFilter="blur(12px)"
      border="6px solid #80bFFF"
      borderRadius="38px"
      maxW="max-content"
      px={4}
      py={4}
    >
      <HStack gap={4}>
        <Box w={{ md: "60px", base: "80px" }} h={{ md: "60px", base: "80px" }}>
          <Image
            src={logo}
            alt="Логотип"
            fit="fill"
          />
        </Box>

        <VStack align="flex-start" h="60px" justifyContent="space-between">
          <Tooltip 
            hasArrow={false} 
            label={isCopied ? "Скопировано" : "Скопировать"} 
            fontSize="10px"  
            placement="right-end" 
            color = {isCopied ? "#80BFFF" : "white"}
            bgColor= {isCopied ? "#284159" : "#284159"}
            closeOnClick={false} 
          >
            <Text 
              fontSize={{ md: "30px", base: "30px" }}
              bgColor="#80bFFF"
              bgClip="text"
              fontFamily="heading"
              lineHeight={"24px"}
              
              cursor="pointer"
              onClick={handleCopy}
              onMouseLeave={handleMouseLeave}
              
              transition="all 0.45s ease-out"
              _hover={{
                bgColor: "#FFFFFF",
              }}
            >
              RevizeMC.net
            </Text>
          </Tooltip>

          <Text fontSize={{ md: "22px", base: "22px" }} bgColor="white" bgClip="text" fontFamily="body" lineHeight={"26px"}>
            Играй по-новому!
          </Text>
        </VStack>
      </HStack>
    </Container>
  );
};