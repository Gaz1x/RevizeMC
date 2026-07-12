import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Button,
  Collapse,
  Image,
  SimpleGrid,
  useBreakpointValue
} from '@chakra-ui/react';
import { useState, useRef, useEffect } from 'react'; // <-- ДОБАВИЛИ useRef и useEffect
import { AnimatePresence, motion } from 'framer-motion'; 

import rulesLogo from "./images/rulesLogo.png";

export const RulesBlock = () => {
  const [activeTab, setActiveTab] = useState<number | null>(null);
  
  // 1. Создаем ссылку-якорь на нижнюю часть блока
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  const isDesktop = useBreakpointValue({ base: false, xl: true });
  
  const RULES_DATA = [
    {
      title: "УЧЁТНЫЕ ЗАПИСИ",
      content: (
        <Box w="full" borderRadius="18px" border="solid #80BFFF" borderWidth={{xl: "6px", base: "4px"}} p={3} fontFamily="heading" bgColor="#1B2D3F">
          <Text color="#80BFFF" fontWeight="bold" mb={2} fontSize={{ xl: "lg", base: "md" }} lineHeight={"1"}>1. УЧЁТНЫЕ ЗАПИСИ</Text>
          <Text fontSize={{xl: "lg", base: "15px"}} mb={2} color="white" lineHeight={"1"}>1.1. ПЕРЕДАЧА АККАУНТА ТРЕТЬИМ ЛИЦАМ {!isDesktop && <br />} <Text as="span" color="#80BFFF"> БЛОКИРОВКА НАВСЕГДА </Text></Text>
          <Text fontSize={{xl: "lg", base: "15px"}} color="white" lineHeight={"1"}>1.2. СОЗДАНИЕ ДВУХ {!isDesktop && <br />} И БОЛЕЕ АККАУНТОВ {!isDesktop && <br />} <Text as="span" color="#80BFFF"> БЛОКИРОВКА НАВСЕГДА </Text></Text>
        </Box>
      )
    },
    {
      title: "ПСЕВДОНИМЫ",
      content: (
        <Box w="full" borderRadius="18px" border="solid #80BFFF" borderWidth={{xl: "6px", base: "4px"}} p={3} fontFamily="heading" bgColor="#1B2D3F">
          <Text color="#80BFFF" fontWeight="bold" mb={2} fontSize={{ xl: "lg", base: "md" }} lineHeight={"1"}>2. ПСЕВДОНИМЫ</Text>
          <Text fontSize={{xl: "lg", base: "15px"}} mb={2} color="white" lineHeight={"1"}>2.1. АГРЕССИВНЫЕ ВЫСКАЗЫВАНИЯ {!isDesktop && <br />} <Text as="span" color="#80BFFF"> БЛОКИРОВКА НАВСЕГДА </Text></Text>
          <Text fontSize={{xl: "lg", base: "15px"}} mb={2} color="white" lineHeight={"1"}>2.2. АССОЦИАЦИЯ С АДМИНИСТРАЦИЕЙ {!isDesktop && <br />} <Text as="span" color="#80BFFF"> БЛОКИРОВКА НАВСЕГДА </Text></Text>
          <Text fontSize={{xl: "lg", base: "15px"}} color="white" lineHeight={"1"}>2.3. ЗАПРЕЩЁННЫЕ НА {!isDesktop && <br />}TWITCH ВЫРАЖЕНИЯ {!isDesktop && <br />} <Text as="span" color="#80BFFF"> БЛОКИРОВКА НАВСЕГДА </Text></Text>
        </Box>
      )
    },
    {
      title: "КОММУНИКАЦИЯ",
      content: (
        <Box w="full" borderRadius="18px" border="solid #80BFFF" borderWidth={{xl: "6px", base: "4px"}} p={3} fontFamily="heading" bgColor="#1B2D3F">
          <Text color="#80BFFF" fontWeight="bold" mb={2} fontSize={{ xl: "lg", base: "md" }} lineHeight={"1"}>3. КОММУНИКАЦИЯ</Text>
          <Text fontSize={{xl: "lg", base: "15px"}} mb={2} color="white" lineHeight={"1"}>3.1. РАЗДРАЖАЮЩИЕ СООБЩЕНИЯ {!isDesktop && <br />} <Text as="span" color="#80BFFF"> БЛОКИРОВКА НА 1 ДЕНЬ</Text> </Text>
          <Text fontSize={{xl: "lg", base: "15px"}} mb={2} color="white" lineHeight={"1"}>3.2. АГРЕССИВНЫЕ ВЫСКАЗЫВАНИЯ {!isDesktop && <br />} <Text as="span" color="#80BFFF"> БЛОКИРОВКА НА 7 ДНЕЙ</Text> </Text>
          <Text fontSize={{xl: "lg", base: "15px"}} color="white" lineHeight={"1"}>3.3. ЗАПРЕЩЁННЫЕ НА {!isDesktop && <br />}TWITCH ВЫРАЖЕНИЯ {!isDesktop && <br />} <Text as="span" color="#80BFFF"> БЛОКИРОВКА НА 7 ДНЕЙ</Text> </Text>
        </Box>
      )
    },
    {
      title: "ИГРОВЫЕ ДЕЙСТВИЯ",
      content: (
        <Box w="full" borderRadius="18px" border="solid #80BFFF" borderWidth={{xl: "6px", base: "4px"}} p={3} fontFamily="heading" bgColor="#1B2D3F">
          <Text color="#80BFFF" fontWeight="bold" mb={2} fontSize={{ xl: "lg", base: "md" }} lineHeight={"1"}>4. ИГРОВЫЕ ДЕЙСТВИЯ</Text>
          <Text fontSize={{xl: "lg", base: "15px"}} mb={2} color="white" lineHeight={"1"}>4.1. СОЗДАНИЕ ПОМЕХ {!isDesktop && <br />} НА ВИДЕОСЪЁМКАХ {!isDesktop && <br />} <Text as="span" color="#80BFFF"> БЛОКИРОВКА НА 7 ДНЕЙ </Text></Text>
          <Text fontSize={{xl: "lg", base: "15px"}} mb={2} color="white" lineHeight={"1"}>4.2. СОЗДАНИЕ ОБЪЕКТОВ НЕПРИЕМЛЕВОЙ ФОРМЫ {!isDesktop && <br />} <Text as="span" color="#80BFFF"> БЛОКИРОВКА НА 7 ДНЕЙ </Text> </Text>
          <Text fontSize={{xl: "lg", base: "15px"}} mb={2} color="white" lineHeight={"1"}>4.3. ДЕСТАБИЛИЗАЦИЯ ИГРОВОЙ ЭКОНОМИКИ {!isDesktop && <br />} <Text as="span" color="#80BFFF"> БЛОКИРОВКА НА 7 ДНЕЙ </Text> </Text>
          <Text fontSize={{xl: "lg", base: "15px"}} mb={2} color="white" lineHeight={"1"}>4.4. ДЕСТАБИЛИЗАЦИЯ {!isDesktop && <br />} РАБОТЫ СЕРВЕРА {!isDesktop && <br />} <Text as="span" color="#80BFFF"> БЛОКИРОВКА НАВСЕГДА </Text></Text>
          <Text fontSize={{xl: "lg", base: "15px"}} color="white" lineHeight={"1"}>4.5. ИСПОЛЬЗОВАНИЕ ТЕХНИЧЕСКИХ ОШИБОК {!isDesktop && <br />} <Text as="span" color="#80BFFF"> БЛОКИРОВКА НАВСЕГДА </Text></Text>
        </Box>
      )
    },
    {
      title: "МОДИФИКАЦИИ",
      content: (
        <Box w="full" borderRadius="18px" border="solid #80BFFF" borderWidth={{xl: "6px", base: "4px"}} p={3} fontFamily="heading" bgColor="#1B2D3F">
          <Text color="#80BFFF" fontWeight="bold" mb={2} fontSize={{ xl: "lg", base: "md" }} lineHeight={"1"}>5. ИГРОВЫЕ МОДИФИКАЦИИ</Text>
          <Text fontSize={{xl: "lg", base: "15px"}} mb={2} color="white" lineHeight={"1"}>5.1. СРАЖЕНИЯ (AIMBOT,{!isDesktop && <br />} REACH, KILLAURA) {!isDesktop && <br />} <Text as="span" color="#80BFFF">БЛОКИРОВКА НАВСЕГДА </Text></Text>
          <Text fontSize={{xl: "lg", base: "15px"}} mb={2} color="white" lineHeight={"1"}>5.2. ВИДЕНИЕ И ОБЗОР{!isDesktop && <br />} (ESP, WALLHACK, X-RAY) {!isDesktop && <br />} <Text as="span" color="#80BFFF"> БЛОКИРОВКА НАВСЕГДА </Text> </Text>
          <Text fontSize={{xl: "lg", base: "15px"}} mb={2} color="white" lineHeight={"1"}>5.3. ИЗМЕНЕНИЕ ДВИЖЕНИЙ{!isDesktop && <br />} (SPEED, FLIGHT, NOCLIP) {!isDesktop && <br />} <Text as="span" color="#80BFFF"> БЛОКИРОВКА НАВСЕГДА </Text> </Text>
          <Text fontSize={{xl: "lg", base: "15px"}} mb={2} color="white" lineHeight={"1"}>5.4. АВТОМАТИЗАЦИЯ{!isDesktop && <br />} (AUTOCLICKER, SCAFFOLD) {!isDesktop && <br />} <Text as="span" color="#80BFFF"> БЛОКИРОВКА НАВСЕГДА </Text> </Text>
          <Text fontSize={{xl: "lg", base: "15px"}} mb={2} color="white" lineHeight={"1"}>5.5. ЗАЩИТА ПЕРСОНАЖА{!isDesktop && <br />} (NOFALL, ANTIKNOCKBACK) {!isDesktop && <br />} <Text as="span" color="#80BFFF"> БЛОКИРОВКА НАВСЕГДА </Text> </Text>
          <Text fontSize={{xl: "lg", base: "15px"}} mb={2} color="white" lineHeight={"1"}>5.6. АВТОНОМНЫЕ БОТЫ{!isDesktop && <br />} (BARITONE, AUTOFISH) {!isDesktop && <br />} <Text as="span" color="#80BFFF"> БЛОКИРОВКА НАВСЕГДА </Text> </Text>
          <Text fontSize={{xl: "lg", base: "15px"}} color={{xl: "#80BFFF", base: "white"}} fontWeight="bold" lineHeight={"1"}>ЗАПРЕЩЕНЫ МОДИФИКАЦИИ{!isDesktop && <br />} С ПОХОЖИМ ФУНКЦИОНАЛОМ</Text>
        </Box>
      )
    },
    {
      title: "PVE-СЕРВЕРЫ",
      content: (
        <Box w="full" borderRadius="18px" border="solid #80BFFF" borderWidth={{xl: "6px", base: "4px"}} p={3} fontFamily="heading" bgColor="#1B2D3F">
          <Text color="#80BFFF" fontWeight="bold" mb={2} fontSize={{ xl: "lg", base: "md" }} lineHeight={"1"}>6. PVE-СЕРВЕРЫ</Text>
          <Text fontSize={{xl: "lg", base: "15px"}} mb={2} color="white" lineHeight={"1"}>6.1. НЕСОГЛАСОВАННОЕ СОСЕДСТВО/НАПАДЕНИЕ {!isDesktop && <br />} <Text as="span" color="#80BFFF"> БЛОКИРОВКА НА 1 ДЕНЬ </Text></Text>
          <Text fontSize={{xl: "lg", base: "15px"}} mb={2} color="white" lineHeight={"1"}>6.2. ПРИСВОЕНИЕ ЧУЖИХ ТЕРРИТОРИЙ/РЕСУРСОВ {!isDesktop && <br />} <Text as="span" color="#80BFFF"> БЛОКИРОВКА НА 7 ДНЕЙ </Text></Text>
          <Text fontSize={{xl: "lg", base: "15px"}} color="white" lineHeight={"1"}>6.3. ВРЕДИТЕЛЬСТВО НА ЛЮБОЙ ТЕРРИТОРИИ {!isDesktop && <br />} <Text as="span" color="#80BFFF"> БЛОКИРОВКА НА 7 ДНЕЙ </Text></Text>
        </Box>
      )
    }
  ];
  // 2. Эффект, который следит за изменением активной вкладки
  useEffect(() => {
    if (isDesktop && activeTab !== null && scrollAnchorRef.current) {
      // Даем анимации 150мс на то, чтобы начать раздвигать контейнер,
      // а затем плавно доскролливаем страницу
      setTimeout(() => {
        scrollAnchorRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center', // "nearest" прокрутит страницу ровно настолько, чтобы низ блока показался на экране
        });
      }, 150);
    }
  }, [activeTab]); // Срабатывает каждый раз при изменении activeTab

  const mobileCollapseTransition = {
    enter: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
    exit: { duration: 0.3, ease: [0.4, 0, 1, 1] as [number, number, number, number] }
  };

  return (
    <VStack
      w="full"
      maxW={{ xl: "1036px", base: "380px" }}
      bgGradient="linear(to-t, transparent, rgba(153, 217, 255, 0.15))"
      border="solid #80BFFF"
      borderWidth={{ xl: "6px", base: "4px" }}
      borderRadius="30px"
      p={4}
      mt="30px"
      // mb={{ xl: "100px", base: "60px" }}
      spacing={6}
      align="stretch"
      transition="all 0.45s ease-out"
    >
      <HStack alignItems="center">
        <Box w={{xl: "36px", base: "27px"}} h={{xl: "36px", base: "27px"}}>
          <Image
              src={rulesLogo}
              alt="Правила"
              fit="fill"
              draggable={false} 
              userSelect="none"
          />    
        </Box>

        <Text 
          fontSize={{ base: "xl", xl: "3xl" }} 
          fontFamily="heading" 
          color="#80BFFF"
          lineHeight={"1"}
        >
          ПРАВИЛА ИГРЫ
        </Text>
      </HStack>

      <Box w="full">
        
        {/* ВЕРХНИЙ БЛОК: Сетка кнопок */}
        <SimpleGrid columns={{ base: 1, xl: 3 }} spacing={3} w="full">
          {RULES_DATA.map((rule, index) => {
            const isActive = activeTab === index;
            return (
              <Box key={rule.title} w="full">
                <Button
                  w="full"
                  onClick={() => setActiveTab(isActive ? null : index)}
                  bg={isActive ? "#80BFFF" : "#1B2D3F"}
                  color={isActive ? "#1B2D3F" : "white"}
                  border="solid #80BFFF"
                  borderWidth={{ xl: "6px", base: "4px" }}
                  h={"50px"}
                  borderRadius="18px"
                  fontFamily="heading"
                  fontWeight="bold"
                  fontSize={{ xl: "md", base: "sm" }}
                  transition="all 0.2s ease-out"
                  px={2}
                  _hover={{
                    transform: "scale(0.98)",
                    borderColor: !isActive ? "white" : "transparent"
                  }}
                  _active={{
                    transform: "scale(0.95)"
                  }}
                >
                  {rule.title}
                </Button>

                {/* МОБИЛЬНАЯ ВЕРСИЯ */}
                <Box display={{ base: "block", xl: "none" }} w="full">
                  <Collapse 
                    in={isActive} 
                    animateOpacity 
                    unmountOnExit
                    transition={mobileCollapseTransition}
                  >
                    <Box pt={3} pb={1} overflow="hidden">
                      {rule.content}
                    </Box>
                  </Collapse>
                </Box>
              </Box>
            );
          })}
        </SimpleGrid>

        {/* ДЕСКТОПНАЯ ВЕРСИЯ */}
        <Box 
          display={{ base: "none", xl: "block" }} 
          w="full" 
          mt={activeTab !== null ? 3 : 0} 
          transition="margin-top 0.4s cubic-bezier(0.4, 0, 0.2, 1)" 
        >
          <AnimatePresence mode="wait">
            {activeTab !== null && (
              <motion.div
                key={activeTab} 
                initial={{ height: 0, opacity: 0, y: -10 }} 
                animate={{ height: "auto", opacity: 1, y: 0 }} 
                exit={{ height: 0, opacity: 0, y: -10 }} 
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }} 
                style={{ overflow: "hidden" }} 
              >
                <Box w="full" pt={0} pb={0}>
                  {RULES_DATA[activeTab].content}
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

      </Box>

      {/* 3. Невидимый элемент-якорь для доскролливания к низу компонента */}
      <Box ref={scrollAnchorRef} h="1px" w="full" mt={"-26px"} />

    </VStack>
  );
};