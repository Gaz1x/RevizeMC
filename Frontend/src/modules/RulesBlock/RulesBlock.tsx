import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Collapse,
  Image,
  SimpleGrid,
  useBreakpointValue
} from '@chakra-ui/react';
import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion'; 

import rulesLogo from "./images/newRulesLogo.png";

export const RulesBlock = () => {
  /* СОСТОЯНИЯ И РЕФЫ */
  const [activeTab, setActiveTab] = useState<number | null>(null);
  
  const desktopContentRef = useRef<HTMLDivElement>(null);
  const blockTopRef = useRef<HTMLDivElement>(null);
  const prevTabRef = useRef<number | null>(null);

  const isDesktop = useBreakpointValue({ base: false, xl: true });
  
  /* ДАННЫЕ ПРАВИЛ */
  const RULES_DATA = [
    {
      title: "АККАУНТЫ",
      content: (
        <Box 
          w="full" 
          borderRadius="18px" 
          border="solid #ffff80" 
          borderWidth={{ xl: "6px", base: "4px" }} 
          p={3} 
          fontFamily="heading" 
          bgColor="#595928"
        >
          <Text 
            color="#ffff80" 
            fontWeight="bold" 
            mb={2} 
            fontSize={{ xl: "lg", base: "md" }} 
            lineHeight="1"
          >
            1. УЧЁТНЫЕ ЗАПИСИ
          </Text>
          <Text 
            fontSize={{ xl: "lg", base: "15px" }} 
            mb={2} 
            color="white" 
            lineHeight="1"
          >
            1.1. ПЕРЕДАЧА АККАУНТА ТРЕТЬИМ ЛИЦАМ {!isDesktop && <br />} 
            <Text 
              as="span" 
              color="#ffff80"
            >
              {' БЛОКИРОВКА НАВСЕГДА '}
            </Text>
          </Text>
          <Text 
            fontSize={{ xl: "lg", base: "15px" }} 
            color="white" 
            lineHeight="1"
          >
            1.2. СОЗДАНИЕ ДВУХ {!isDesktop && <br />} И БОЛЕЕ АККАУНТОВ {!isDesktop && <br />} 
            <Text 
              as="span" 
              color="#ffff80"
            >
              {' БЛОКИРОВКА НАВСЕГДА '}
            </Text>
          </Text>
        </Box>
      )
    },
    {
      title: "ПСЕВДОНИМЫ",
      content: (
        <Box 
          w="full" 
          borderRadius="18px" 
          border="solid #ffff80" 
          borderWidth={{ xl: "6px", base: "4px" }} 
          p={3} 
          fontFamily="heading" 
          bgColor="#595928"
        >
          <Text 
            color="#ffff80" 
            fontWeight="bold" 
            mb={2} 
            fontSize={{ xl: "lg", base: "md" }} 
            lineHeight="1"
          >
            2. ПСЕВДОНИМЫ
          </Text>
          <Text 
            fontSize={{ xl: "lg", base: "15px" }} 
            mb={2} 
            color="white" 
            lineHeight="1"
          >
            2.1. АГРЕССИВНЫЕ ВЫСКАЗЫВАНИЯ {!isDesktop && <br />} 
            <Text 
              as="span" 
              color="#ffff80"
            >
              {' БЛОКИРОВКА НАВСЕГДА '}
            </Text>
          </Text>
          <Text 
            fontSize={{ xl: "lg", base: "15px" }} 
            mb={2} 
            color="white" 
            lineHeight="1"
          >
            2.2. АССОЦИАЦИЯ С АДМИНИСТРАЦИЕЙ {!isDesktop && <br />} 
            <Text 
              as="span" 
              color="#ffff80"
            >
              {' БЛОКИРОВКА НАВСЕГДА '}
            </Text>
          </Text>
          <Text 
            fontSize={{ xl: "lg", base: "15px" }} 
            color="white" 
            lineHeight="1"
          >
            2.3. ЗАПРЕЩЁННЫЕ НА {!isDesktop && <br />}TWITCH ВЫРАЖЕНИЯ {!isDesktop && <br />} 
            <Text 
              as="span" 
              color="#ffff80"
            >
              {' БЛОКИРОВКА НАВСЕГДА '}
            </Text>
          </Text>
        </Box>
      )
    },
    {
      title: "МОДИФИКАЦИИ",
      content: (
        <Box 
          w="full" 
          borderRadius="18px" 
          border="solid #ffff80" 
          borderWidth={{ xl: "6px", base: "4px" }} 
          p={3} 
          fontFamily="heading" 
          bgColor="#595928"
        >
          <Text 
            color="#ffff80" 
            fontWeight="bold" 
            mb={2} 
            fontSize={{ xl: "lg", base: "md" }} 
            lineHeight="1"
          >
            3. ИГРОВЫЕ МОДИФИКАЦИИ
          </Text>
          <Text 
            fontSize={{ xl: "lg", base: "15px" }} 
            mb={2} 
            color="white" 
            lineHeight="1"
          >
            3.1. СРАЖЕНИЯ (AIMBOT,{!isDesktop && <br />} REACH, KILLAURA) {!isDesktop && <br />} 
            <Text 
              as="span" 
              color="#ffff80"
            >
              {' БЛОКИРОВКА НАВСЕГДА '}
            </Text>
          </Text>
          <Text 
            fontSize={{ xl: "lg", base: "15px" }} 
            mb={2} 
            color="white" 
            lineHeight="1"
          >
            3.2. ВИДЕНИЕ И ОБЗОР{!isDesktop && <br />} (ESP, WALLHACK, X-RAY) {!isDesktop && <br />} 
            <Text 
              as="span" 
              color="#ffff80"
            >
              {' БЛОКИРОВКА НАВСЕГДА '}
            </Text>
          </Text>
          <Text 
            fontSize={{ xl: "lg", base: "15px" }} 
            mb={2} 
            color="white" 
            lineHeight="1"
          >
            3.3. ИЗМЕНЕНИЕ ДВИЖЕНИЙ{!isDesktop && <br />} (SPEED, FLIGHT, NOCLIP) {!isDesktop && <br />} 
            <Text 
              as="span" 
              color="#ffff80"
            >
              {' БЛОКИРОВКА НАВСЕГДА '}
            </Text>
          </Text>
          <Text 
            fontSize={{ xl: "lg", base: "15px" }} 
            mb={2} 
            color="white" 
            lineHeight="1"
          >
            3.4. АВТОМАТИЗАЦИЯ{!isDesktop && <br />} (AUTOCLICKER, SCAFFOLD) {!isDesktop && <br />} 
            <Text 
              as="span" 
              color="#ffff80"
            >
              {' БЛОКИРОВКА НАВСЕГДА '}
            </Text>
          </Text>
          <Text 
            fontSize={{ xl: "lg", base: "15px" }} 
            mb={2} 
            color="white" 
            lineHeight="1"
          >
            3.5. ЗАЩИТА ПЕРСОНАЖА{!isDesktop && <br />} (NOFALL, ANTIKNOCKBACK) {!isDesktop && <br />} 
            <Text 
              as="span" 
              color="#ffff80"
            >
              {' БЛОКИРОВКА НАВСЕГДА '}
            </Text>
          </Text>
          <Text 
            fontSize={{ xl: "lg", base: "15px" }} 
            mb={2} 
            color="white" 
            lineHeight="1"
          >
            3.6. АВТОНОМНЫЕ БОТЫ{!isDesktop && <br />} (BARITONE, AUTOFISH) {!isDesktop && <br />} 
            <Text 
              as="span" 
              color="#ffff80"
            >
              {' БЛОКИРОВКА НАВСЕГДА '}
            </Text>
          </Text>
          <Text 
            fontSize={{ xl: "lg", base: "15px" }} 
            color={{ lg: "#ffff80", base: "white" }} 
            fontWeight="bold" 
            lineHeight="1"
          >
            ЗАПРЕЩЕНЫ МОДИФИКАЦИИ{!isDesktop && <br />} С ПОХОЖИМ ФУНКЦИОНАЛОМ
          </Text>
        </Box>
      )
    },
    {
      title: "ОБЩЕНИЕ",
      content: (
        <Box 
          w="full" 
          borderRadius="18px" 
          border="solid #ffff80" 
          borderWidth={{ xl: "6px", base: "4px" }} 
          p={3} 
          fontFamily="heading" 
          bgColor="#595928"
        >
          <Text 
            color="#ffff80" 
            fontWeight="bold" 
            mb={2} 
            fontSize={{ xl: "lg", base: "md" }} 
            lineHeight="1"
          >
            4. КОММУНИКАЦИЯ
          </Text>
          <Text 
            fontSize={{ xl: "lg", base: "15px" }} 
            mb={2} 
            color="white" 
            lineHeight="1"
          >
            4.1. РАЗДРАЖАЮЩИЕ СООБЩЕНИЯ {!isDesktop && <br />} 
            <Text 
              as="span" 
              color="#ffff80"
            >
              {' БЛОКИРОВКА НА 1 ДЕНЬ '}
            </Text>
          </Text>
          <Text 
            fontSize={{ xl: "lg", base: "15px" }} 
            mb={2} 
            color="white" 
            lineHeight="1"
          >
            4.2. АГРЕССИВНЫЕ ВЫСКАЗЫВАНИЯ {!isDesktop && <br />} 
            <Text 
              as="span" 
              color="#ffff80"
            >
              {' БЛОКИРОВКА НА 7 ДНЕЙ '}
            </Text>
          </Text>
          <Text 
            fontSize={{ xl: "lg", base: "15px" }} 
            color="white" 
            lineHeight="1"
          >
            4.3. ЗАПРЕЩЁННЫЕ НА {!isDesktop && <br />}TWITCH ВЫРАЖЕНИЯ {!isDesktop && <br />} 
            <Text 
              as="span" 
              color="#ffff80"
            >
              {' БЛОКИРОВКА НА 7 ДНЕЙ '}
            </Text>
          </Text>
        </Box>
      )
    },
    {
      title: "ИГРА",
      content: (
        <Box 
          w="full" 
          borderRadius="18px" 
          border="solid #ffff80" 
          borderWidth={{ xl: "6px", base: "4px" }} 
          p={3} 
          fontFamily="heading" 
          bgColor="#595928"
        >
          <Text 
            color="#ffff80" 
            fontWeight="bold" 
            mb={2} 
            fontSize={{ xl: "lg", base: "md" }} 
            lineHeight="1"
          >
            5. ИГРОВЫЕ ДЕЙСТВИЯ
          </Text>
          <Text 
            fontSize={{ xl: "lg", base: "15px" }} 
            mb={2} 
            color="white" 
            lineHeight="1"
          >
            5.1. СОЗДАНИЕ ПОМЕХ {!isDesktop && <br />} НА ВИДЕОСЪЁМКАХ {!isDesktop && <br />} 
            <Text 
              as="span" 
              color="#ffff80"
            >
              {' БЛОКИРОВКА НА 7 ДНЕЙ '}
            </Text>
          </Text>
          <Text 
            fontSize={{ xl: "lg", base: "15px" }} 
            mb={2} 
            color="white" 
            lineHeight="1"
          >
            5.2. СОЗДАНИЕ ОБЪЕКТОВ НЕПРИЕМЛЕВОЙ ФОРМЫ {!isDesktop && <br />} 
            <Text 
              as="span" 
              color="#ffff80"
            >
              {' БЛОКИРОВКА НА 7 ДНЕЙ '}
            </Text>
          </Text>
          <Text 
            fontSize={{ xl: "lg", base: "15px" }} 
            mb={2} 
            color="white" 
            lineHeight="1"
          >
            5.3. ДЕСТАБИЛИЗАЦИЯ ИГРОВОЙ ЭКОНОМИКИ {!isDesktop && <br />} 
            <Text 
              as="span" 
              color="#ffff80"
            >
              {' БЛОКИРОВКА НА 7 ДНЕЙ '}
            </Text>
          </Text>
          <Text 
            fontSize={{ xl: "lg", base: "15px" }} 
            mb={2} 
            color="white" 
            lineHeight="1"
          >
            5.4. ДЕСТАБИЛИЗАЦИЯ {!isDesktop && <br />} РАБОТЫ СЕРВЕРА {!isDesktop && <br />} 
            <Text 
              as="span" 
              color="#ffff80"
            >
              {' БЛОКИРОВКА НАВСЕГДА '}
            </Text>
          </Text>
          <Text 
            fontSize={{ xl: "lg", base: "15px" }} 
            color="white" 
            lineHeight="1"
          >
            5.5. ИСПОЛЬЗОВАНИЕ ТЕХНИЧЕСКИХ ОШИБОК {!isDesktop && <br />} 
            <Text 
              as="span" 
              color="#ffff80"
            >
              {' БЛОКИРОВКА НАВСЕГДА '}
            </Text>
          </Text>
        </Box>
      )
    }
  ];

  /* ЛОГИКА АВТОСКРОЛЛА */
  useEffect(() => {
    const isSwitching = prevTabRef.current !== null && activeTab !== null && prevTabRef.current !== activeTab;
    prevTabRef.current = activeTab;

    if (isDesktop && activeTab !== null) {
      // Задержка при переключении больше, чтобы старая вкладка успела скрыться (mode="wait")
      const delay = isSwitching ? 850 : 450;

      const timer = setTimeout(() => {
        if (desktopContentRef.current) {
          const rect = desktopContentRef.current.getBoundingClientRect();
          const BOTTOM_OFFSET = 30; 

          if (rect.bottom > window.innerHeight - BOTTOM_OFFSET) {
            const scrollAmount = rect.bottom - window.innerHeight + BOTTOM_OFFSET;
            window.scrollBy({
              top: scrollAmount,
              behavior: 'smooth'
            });
          }
        }
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [activeTab, isDesktop]);

  const mobileCollapseTransition = {
    enter: { 
      duration: 0.4, 
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number] 
    },
    exit: { 
      duration: 0.3, 
      ease: [0.4, 0, 1, 1] as [number, number, number, number] 
    }
  };

  return (
    <VStack
      ref={blockTopRef} 
      w="full"
      maxW={{ xl: "1300px", base: "370px" }}
      bgGradient="linear(to-t, transparent, rgba(255, 255, 128, 0.15))"
      border="solid #ffff80"
      borderWidth={{ xl: "6px", base: "4px" }}
      borderRadius="25px"
      p={4}
      mt={{xl: "30px", base: "15px"}} 
      spacing={4}
      align="stretch"
      transition="all 0.45s ease-out"
    >
      {/* ШАПКА БЛОКА */}
      <HStack 
        alignItems="center"
      >
        <Box 
          w={{ xl: "36px", base: "27px" }} 
          h={{ xl: "36px", base: "27px" }}
        >
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
          color="#ffff80"
          lineHeight="1"
        >
          ПРАВИЛА ИГРЫ
        </Text>
      </HStack>

      <Box 
        w="full"
      >
        {/* ВЕРХНИЙ БЛОК: СЕТКА КНОПОК */}
        <SimpleGrid 
          columns={{ base: 1, xl: 5 }} 
          spacing={2} 
          w="full"
        >
          {RULES_DATA.map((rule, index) => {
            const isActive = activeTab === index;
            
            return (
              <Box 
                key={rule.title} 
                w="full"
              >
                <Button
                  w="full"
                  onClick={() => setActiveTab(isActive ? null : index)}
                  bg={isActive ? "#ffff80" : "#595928"}
                  color={isActive ? "#595928" : "white"}
                  border="solid #ffff80"
                  borderWidth={{ xl: "6px", base: "4px" }}
                  h="50px"
                  borderRadius="15px"
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

                {/* МОБИЛЬНАЯ ВЕРСИЯ (Collapse) */}
                <Box 
                  display={{ base: "block", xl: "none" }} 
                  w="full"
                >
                  <Collapse 
                    in={isActive} 
                    animateOpacity 
                    unmountOnExit
                    transition={mobileCollapseTransition}
                  >
                    <Box 
                      pt={3} 
                      pb={1} 
                      overflow="hidden"
                    >
                      {rule.content}
                    </Box>
                  </Collapse>
                </Box>
              </Box>
            );
          })}
        </SimpleGrid>

        {/* ДЕСКТОПНАЯ ВЕРСИЯ (Анимация переключения) */}
        <Box 
          ref={desktopContentRef} 
          display={{ base: "none", xl: "block" }} 
          w="full" 
          mt={activeTab !== null ? 3 : 0} 
          transition="margin-top 0.4s cubic-bezier(0.4, 0, 0.2, 1)" 
        >
          <AnimatePresence 
            mode="wait"
          >
            {activeTab !== null && (
              <motion.div
                key={activeTab} 
                initial={{ height: 0, opacity: 0, y: -10 }} 
                animate={{ height: "auto", opacity: 1, y: 0 }} 
                exit={{ height: 0, opacity: 0, y: -10 }} 
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }} 
                style={{ overflow: "hidden" }} 
              >
                <Box 
                  w="full" 
                  pt={0} 
                  pb={0}
                >
                  {RULES_DATA[activeTab].content}
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

      </Box>
    </VStack>
  );
};