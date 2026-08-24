import { 
  Image, 
  Box, 
  Text, 
  Flex, 
  Container, 
  useClipboard, 
  useBreakpointValue, 
  Button 
} from '@chakra-ui/react';
import { useState } from 'react';
import logo from "./images/logo1.png";

export const Navbar = () => {
  const { onCopy } = useClipboard("revizemc.net");
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [copied, setCopied] = useState(false);

  const isDesktop = useBreakpointValue({ base: false, xl: true });

  const handleCopy = () => {
    if (!isDesktop || isAnimating) return;
    
    onCopy();
    setIsAnimating(true);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500); 

    setTimeout(() => {
      setIsAnimating(false);
    }, 1800);
  };

  return (
    <Flex 
      direction="column" 
      alignItems="center" 
      w="full"
      maxW={{ xl: "1300px", base: "370px" }}
    >
      {/* ВЕРХНИЙ РЯД */}
      <Flex 
        direction="row" 
        alignItems="center"
        justifyContent="space-between" 
        gap={0} 
        mt={{xl: "30px", base: "15px"}} 
        w="full"
      >
        {/* ГРУППА 1: Логотип + Название (ЛЕВЫЙ КРАЙ) */}
        <Flex 
          direction="row" 
          alignItems="center" 
          gap={{ base: "15px", xl: 3 }} 
          flex={{ xl: 1 }} 
          justify={{ base: "center", xl: "flex-start" }}
        >
          {/* Логотип */}
          <Box 
            w={{ xl: "64px", base: "45px" }} 
            h={{ xl: "64px", base: "45px" }}
          >
            <Image
              src={logo}
              alt="Логотип"
              fit="fill"
              draggable={false} 
              userSelect="none"
            />
          </Box>

          {/* Блок копирования IP */}
          <Container
            as="nav"
            role="group" 
            display={"flex"}
            border="solid #80bFFF"
            borderWidth={{ xl: "6px", base: "4px" }}
            borderRadius={{ xl: "14px", base: "12px" }}
            w={{ xl: "320px", base: "310px" }} 
            h={{ xl: "64px", base: "45px" }}
            m={0} 
            p={0}
            alignItems="center"
            justifyContent="center"
            position="relative" 
            cursor={isDesktop ? "pointer" : "default"}
            pointerEvents={isDesktop ? "auto" : "none"}
            onClick={handleCopy}
            transition="all 0.2s ease-in-out" 
            sx={{
              '@media (hover: hover) and (pointer: fine)': {
                '&:hover': { 
                  transform: "scale(0.96)", 
                  border: copied ? "solid #80BFFF 6px" : "solid white 6px" 
                },
                '&:active': { 
                  transform: "scale(0.9)" 
                }
              }
            }}
          >
            {/* Текст 1: REVIZEMC.NET */}
            <Text 
              position="absolute"
              transform={copied ? "scale(0.7)" : "scale(1)"}
              opacity={copied ? 0 : 1} 
              transition="all 0.3s ease-in-out" 
              fontSize={{ xl: "30px", base: "28px" }} 
              bgColor={{xl: "#FFFFFF", base: "#80bfff"}}
              bgClip="text"
              fontFamily="heading"
              lineHeight="1"
              _groupHover={{ bgColor: "#FFFFFF" }} 
            >
              REVIZEMC.NET
            </Text>

            {/* Текст 2: СКОПИРОВАНО */}
            <Text 
              position="absolute"
              transform={copied ? "scale(1)" : "scale(0.7)"}
              opacity={copied ? 1 : 0} 
              transition="all 0.3s ease-in-out"
              fontSize={{ xl: "28px", base: "24px" }} 
              bgColor="#80bFFF"
              bgClip="text"
              fontFamily="heading"
              lineHeight="1"
            >
              СКОПИРОВАНО
            </Text>
          </Container>
        </Flex>

        {/* ГРУППА 2: СЛОГАН (СТРОГО ПО ЦЕНТРУ) */}
        <Flex 
          flex={{ xl: 1 }} 
          justify="center" 
          display={{ base: "none", xl: "flex" }}
        >
          <Box
            border="solid #80bFFF"
            borderWidth={{ xl: "6px", base: "4px" }}
            borderRadius={{ xl: "14px", base: "26px" }}
            h={{ xl: "64px", base: "54px" }}
            m={0} 
            px={3}
            alignItems="center"
            justifyContent="center"
            display="flex"
          >
            <Text 
              fontSize="30px" 
              fontWeight="bold" 
              bgColor="#80bFFF" 
              bgClip="text" 
              fontFamily="body" 
              lineHeight="1.2"
            >
              ИГРАЙ ПО-НОВОМУ!
            </Text>
          </Box>
        </Flex>

        {/* ГРУППА 3: КНОПКИ СОЦСЕТЕЙ (ПРАВЫЙ КРАЙ) */}
        <Flex 
          direction="row" 
          gap={{ xl: 3, base: 6 }} 
          flex={{ xl: 1 }} 
          justify={{ base: "center", xl: "flex-end" }}
          display={{ base: "none", xl: "flex" }}
        >
          {/* Кнопка DISCORD */}
          <Button
            as="a"
            href="https://discord.gg/SJpQDQcJvG" 
            target="_blank"
            w={{ base: "140px", xl: "192px" }} 
            h={{ base: "45px", xl: "64px" }} 
            color="white"
            bgColor="transparent"
            border="solid #80bFFF"
            borderWidth={{ xl: "6px", base: "4px" }}
            borderRadius={{ xl: "14px", base: "12px" }} 
            fontFamily="heading" 
            fontWeight="bold" 
            fontSize={{ base: "14px", xl: "24px" }} 
            transition="all 0.2s ease-out" 
            cursor="pointer"
            _hover={{ transform: "scale(0.96)", borderColor: "white" }}
            _active={{ transform: "scale(0.9)" }}
          >
            DISCORD
          </Button>
  
          {/* Кнопка TELEGRAM */}
          <Button
            as="a"
            href="https://t.me/revizemc" 
            target="_blank"
            w={{ base: "140px", xl: "192px" }}
            h={{ base: "45px", xl: "64px" }} 
            color="white"
            bgColor="transparent"
            border="solid #80bFFF"
            borderWidth={{ xl: "6px", base: "4px" }}
            borderRadius={{ xl: "14px", base: "12px" }} 
            fontFamily="heading" 
            fontWeight="bold" 
            fontSize={{ base: "14px", xl: "24px" }} 
            transition="all 0.2s ease-out" 
            cursor="pointer"
            _hover={{ transform: "scale(0.96)", borderColor: "white" }}
            _active={{ transform: "scale(0.9)" }}
          >
            TELEGRAM
          </Button>
        </Flex>

      </Flex>
    </Flex>
  );
};