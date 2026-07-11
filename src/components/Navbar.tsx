import { Image, Box, Text, HStack, Container, useClipboard, useToast, useBreakpointValue } from '@chakra-ui/react';
import logo from "./images/blueLogo.png";

export const Navbar = () => {
  const { onCopy } = useClipboard("revizemc.net");
  
  // ХУК ДЛЯ ПРОВЕРКИ ЭКРАНА: на ПК вернет true, на мобилках (base) вернет false
  const showToastOnThisDevice = useBreakpointValue({ base: false, xl: true });

  const copyMessage = useToast();
  const COPY_ID = "copy-toast";

  const handleCopy = () => {
    onCopy();

    // Если хук вернул false (мы на телефоне), прерываем функцию и не показываем тост
    if (!showToastOnThisDevice) return;

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

  return (
    <Container
      as="nav"
      mt={"30px"}
      bgGradient="linear(to-t, transparent, rgba(153, 217, 255, 0.15))"
      border="solid #80bFFF"
      borderWidth={{xl: "6px", base: "4px"}}
      borderRadius= {{xl : "38px", base: "26px"}}
      maxW="max-content"
      px={{xl: 4, base: "14px"}}
      py={{xl: 4, base: "12px"}}
      alignItems="center"
    >
      <HStack gap={3} align="center">
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
          display="inline-flex"
          lineHeight={{ xl: "60px", base: "30px" }}
          alignItems="center"
          justifyContent="center"
          
          cursor="pointer"
          onClick={handleCopy}
          transition="all 0.45s ease-in-out"
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
          bgColor= "transparent"
        >
          <Text fontSize={{ xl: "24px", base: "22px" }} bgColor="white" bgClip="text" fontFamily="body" lineHeight={"28px"}>
            ИГРАЙ ПО-НОВОМУ!
          </Text>
        </Box>
      
      </HStack>
    </Container>
  );
};