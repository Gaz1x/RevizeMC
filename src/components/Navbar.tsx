import { Image, Box, Text, HStack, Container, useClipboard, Collapse, ScaleFade, useBreakpointValue } from '@chakra-ui/react';
import { useState } from 'react';
import logo from "./images/logo1.png";

export const Navbar = () => {
  const { onCopy } = useClipboard("revizemc.net");
  
  // 1. Состояние для плавного раздвижения блоков (управление высотой)
  const [showSpace, setShowSpace] = useState(false);
  // 2. Состояние для плавного появления текста "СКОПИРОВАНО"
  const [showText, setShowText] = useState(false);

  const [isAnimating, setIsAnimating] = useState(false);

  const isDesktop = useBreakpointValue({ base: false, xl: true });

const handleCopy = () => {
    if (!isDesktop || isAnimating) return;
    onCopy();
    
    // ЭТАП 1: Начинаем обе анимации мгновенно и ОДНОВРЕМЕННО
    setIsAnimating(true);
    setShowSpace(true);
    setShowText(true);

    // ЭТАП 2: Держим открытым 1.5 секунды (1500мс) и запускаем затухание текста
    setTimeout(() => {
      setShowText(false);
    }, 1000); // Можешь изменить время удержания по вкусу (например, 1000мс)

    // ЭТАП 3: Ждем 300мс (пока текст растворится) и плавно схлопываем блоки
    setTimeout(() => {
      setShowSpace(false);
    }, 1000); // Это значение должно быть на 300мс больше, чем предыдущее

    setTimeout(() => {
      setIsAnimating(false);
    }, 1600);

  };

  return (
    <Box w="full" display="flex" flexDirection="column" alignItems="center" mb={showSpace ? "0px" : "15px"} transition="margin-bottom 0.6s cubic-bezier(0.4, 0, 0.2, 1)">
      
      {/* Навигационная панель */}
      <Container
        as="nav"
        mt={"30px"}
        bgGradient="linear(to-t, transparent, rgba(153, 217, 255, 0.15))"
        border="solid #80bFFF"
        borderWidth={{ xl: "6px", base: "4px" }}
        borderRadius={{ xl: "38px", base: "26px" }}
        maxW="max-content"
        px={{ xl: 4, base: "14px" }}
        py={{ xl: 4, base: "12px" }}
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
            cursor={isDesktop ? "pointer" : "default"}
            pointerEvents={isDesktop ? "auto" : "none"}
            onClick={handleCopy}
            transition="all 0.2s ease-out"
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
            display={{ xl: "block", base: "none" }}
            bgColor="transparent"
          >
            <Text fontSize={{ xl: "24px", base: "22px" }} bgColor="white" bgClip="text" fontFamily="body" lineHeight={"28px"}>
              ИГРАЙ ПО-НОВОМУ!
            </Text>
          </Box>
        </HStack>
      </Container>
          
        {/* РОДИТЕЛЬСКИЙ КОЛЛАПС */}
        <Collapse 
          in={showSpace} 
          startingHeight={0}
          endingHeight={60} // Увеличили высоту блока для воздуха (было 30)
          transition={{ 
            enter: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }, 
            exit: { duration: 0.6, ease: [0.5, 0, 0.25, 1] } 
          }}
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          {/* Увеличили высоту контейнера до 60px и добавили mt="4px" для визуального баланса */}
          <Box display="flex" justifyContent="center" alignItems="center" w="full" h="60px" mt="6px">
            
            <ScaleFade 
              in={showText} 
              initialScale={0.8}
              transition={{ enter: { duration: 0.35 }, exit: { duration: 0.4 } }}
            >
              <Box
                color="#80BFFF"
                textAlign="center"
                minW="260px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text 
                  fontSize="24px" 
                  fontWeight="bold" 
                  // letterSpacing="wide"
                  lineHeight="1"
                  
                >
                  СКОПИРОВАНО
                </Text>
              </Box>
            </ScaleFade>

          </Box>
        </Collapse>
    </Box>
  );
};