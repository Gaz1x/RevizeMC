import { Image, Box, Text, HStack, Container, useClipboard, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import logo from "./images/blueLogo.png";

export const Navbar = () => {
  const { onCopy } = useClipboard("revizemc.net");
  
  const [isCopied, setIsCopied] = useState(false);

  const copyMessage = useToast();
  const COPY_ID = "copy-toast";

  const handleCopy = () => {
    onCopy();
    setIsCopied(true);

    if (!copyMessage.isActive(COPY_ID)) {
      copyMessage({
        id: COPY_ID,
        position: 'bottom',
        duration: 1000,
        render: () => (
          <Box
            color="white"
            p={4}
            bg="#284159"
            border="2px solid #80bFFF"
            borderRadius="2xl"
            boxShadow="xl"
            textAlign="center"
            fontFamily="body"
          >
            <Text>СКОПИРОВАНО</Text>
          </Box>
        ),
      });
    }
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
      top="10px"
      
      // ИСПРАВЛЕНИЕ: Центрируем навбар
      left="50%"
      transform="translateX(-50%)"
      
      zIndex="sticky"
      bg="whiteAlpha.50"
      backdropFilter="blur(12px)"
      border="solid #80bFFF"
      borderWidth={{xl: "6px", base: "4px"}}
      borderRadius= {{xl : "38px", base: "26px"}}
      maxW="max-content"
      px={{xl: 4, base: "14px"}}
      py={{xl: 4, base: "12px"}}
      alignItems="center"
    >
      <HStack gap={3}>
        <Box w={{ xl: "70px", base: "45px" }} h={{ xl: "70px", base: "45px" }}>
          <Image
            src={logo}
            alt="Логотип"
            fit="fill"
            draggable={false} 
            userSelect="none"
          />
        </Box>

        <Text 
          fontSize={{ xl: "60px", base: "30px" }}
          bgColor="#80bFFF"
          bgClip="text"
          fontFamily="heading"
          
          // ИСПРАВЛЕНИЕ ЦЕНТРИРОВАНИЯ:
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          h={{ xl: "70px", base: "40px" }} // Выравниваем по высоте логотипа
          
          cursor="pointer"
          onClick={handleCopy}
          onMouseLeave={handleMouseLeave}
          transition="all 0.45s ease-out"
          sx={{
            '@media (hover: hover) and (pointer: fine)': {
              '&:hover': {
                bgColor: "#FFFFFF",
                transform: "scale(0.99)"
              },
              '&:active': { 
                transform: "scale(0.97)" 
              }
            }
          }}
        >
          REVIZEMC.NET
        </Text>
       
        <Box
          border="6px solid #80bFFF"
          borderRadius="25px"
          py="14px"
          px="14px"
          display = {{xl: "block", base: "none"}}
        >
          <Text fontSize={{ xl: "24px", base: "22px" }} bgColor="white" bgClip="text" fontFamily="body" lineHeight={"28px"}>
            ИГРАЙ ПО-НОВОМУ!
          </Text>
        </Box>
      
      </HStack>
    </Container>
  );
};