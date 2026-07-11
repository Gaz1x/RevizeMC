import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Button,
  Collapse,
} from '@chakra-ui/react';
import { useState } from 'react';

// Обновленный массив с правилами
const RULES_DATA = [
  {
    title: "УЧЁТНЫЕ ЗАПИСИ",
    content: (
      <Box borderRadius="20px" border="solid #80BFFF" borderWidth={{xl: "6px", base: "4px"}} p={{xl: "8px", base: "4px"}} fontFamily="heading" fontSize={"sm"} lineHeight="1ew" letterSpacing="wide">
        <Text color="#80BFFF" fontWeight="bold" mb={2}>1. УЧЁТНЫЕ ЗАПИСИ</Text>
        <Text ml={"1px"} color="white">1.1 ПЕРЕДАЧА АККАУНТА ТРЕТЬИМ ЛИЦАМ • НАВСЕГДА</Text>
        <Text ml={"1px"} color="white">1.2 СОЗДАНИЕ ДОПОЛНИТЕЛЬНОГО АККАУНТА • НАВСЕГДА</Text>
      </Box>
    )
  },
  {
    title: "ПСЕВДОНИМЫ",
    content: (
      <Box borderRadius="20px" border="solid #80BFFF" borderWidth={{xl: "6px", base: "4px"}} p={{xl: "8px", base: "4px"}} fontFamily="heading" fontSize={"sm"} lineHeight="1ew" letterSpacing="wide">
        <Text color="#80BFFF" fontWeight="bold" mb={2}>2. ПСЕВДОНИМЫ</Text>
        <Text ml={"1px"} color="white">2.1 АГРЕССИВНЫЕ ВЫСКАЗЫВАНИЯ • НАВСЕГДА</Text>
        <Text ml={"1px"} color="white">2.2 АССОЦИАЦИЯ С АДМИНИСТРАЦИЕЙ • НАВСЕГДА</Text>
        <Text ml={"1px"} color="white">2.3 ЗАПРЕЩЁННЫЕ НА TWITCH ВЫРАЖЕНИЯ • НАВСЕГДА</Text>
      </Box>
    )
  },
  {
    title: "КОММУНИКАЦИЯ",
    content: (
      <Box borderRadius="20px" border="solid #80BFFF" borderWidth={{xl: "6px", base: "4px"}} p={{xl: "8px", base: "4px"}}  fontFamily="heading" fontSize={"sm"} lineHeight="1ew" letterSpacing="wide">
        <Text color="#80BFFF" fontWeight="bold" mb={2}>3. КОММУНИКАЦИЯ</Text>
        <Text ml={"1px"} color="white">3.1 РАЗДРАЖАЮЩИЕ СООБЩЕНИЯ • 1 ДЕНЬ</Text>
        <Text ml={"1px"} color="white">3.2 АГРЕССИВНЫЕ ВЫСКАЗЫВАНИЯ • 7 ДНЕЙ</Text>
        <Text ml={"1px"} color="white">3.3 ЗАПРЕЩЁННЫЕ НА TWITCH ВЫРАЖЕНИЯ • 7 ДНЕЙ</Text>
      </Box>
    )
  },
  {
    title: "ИГРОВЫЕ ДЕЙСТВИЯ",
    content: (
      <Box borderRadius="20px" border="solid #80BFFF" borderWidth={{xl: "6px", base: "4px"}} p={{xl: "8px", base: "4px"}}  fontFamily="heading" fontSize={"sm"} lineHeight="1ew" letterSpacing="wide">
        <Text color="#80BFFF" fontWeight="bold" mb={2}>4. ИГРОВЫЕ ДЕЙСТВИЯ</Text>
        <Text ml={"1px"} color="white">4.1 ПОМЕХИ НА ТРАНСЛЯЦИЯХ И СЪЁМКАХ • 7 ДНЕЙ</Text>
        <Text ml={"1px"} color="white">4.2 СОЗДАНИЕ НЕПРИЕМЛЕМЫХ ПОСТРОЕК • 7 ДНЕЙ</Text>
        <Text ml={"1px"} color="white">4.3 ДЕСТАБИЛИЗАЦИЯ ИГРОВОЙ ЭКОНОМИКИ • 7 ДНЕЙ</Text>
        <Text ml={"1px"} color="white">4.4 ДЕСТАБИЛИЗАЦИЯ РАБОТЫ СЕРВЕРА/КЛИЕНТА • НАВСЕГДА</Text>
        <Text ml={"1px"} color="white">4.5 ИСПОЛЬЗОВАНИЕ ТЕХНИЧЕСКИХ УЯЗВИМОСТЕЙ • НАВСЕГДА</Text>
      </Box>
    )
  },
  {
    title: "МОДИФИКАЦИИ",
    content: (
      <Box borderRadius="20px" border="solid #80BFFF" borderWidth={{xl: "6px", base: "4px"}} p={{xl: "8px", base: "4px"}}  fontFamily="heading" fontSize={"sm"} lineHeight="1ew" letterSpacing="wide">
        <Text color="#80BFFF" fontWeight="bold" mb={2}>5. ИГРОВЫЕ МОДИФИКАЦИИ</Text>
        <Text ml={"1px"} color="white">5.1 СРАЖЕНИЯ (AIMBOT, REACH, KILLAURA) • НАВСЕГДА</Text>
        <Text ml={"1px"} color="white">5.2 ВИДЕНИЕ И ОБЗОР (ESP, WALLHACK, X-RAY) • НАВСЕГДА</Text>
        <Text ml={"1px"} color="white">5.3 ИЗМЕНЕНИЕ ДВИЖЕНИЙ (SPEED, FLIGHT, NOCLIP) • НАВСЕГДА</Text>
        <Text ml={"1px"} color="white">5.4 АВТОМАТИЗАЦИЯ (AUTOCLICKER, SCAFFOLD) • НАВСЕГДА</Text>
        <Text ml={"1px"} color="white">5.5 ЗАЩИТА ПЕРСОНАЖА (NOFALL, ANTIKNOCKBACK) • НАВСЕГДА</Text>
        <Text ml={"1px"} color="white">5.6 АВТОНОМНЫЕ БОТЫ (BARITONE, AUTOFISH) • НАВСЕГДА</Text>
        <Text ml={"1px"} color="#80BFFF" fontWeight="bold" mt={2}>ЗАПРЕЩЕНЫ МОДИФИКАЦИИ С ПОХОЖИМ ФУНКЦИОНАЛОМ</Text>
      </Box>
    )
  },
  {
    title: "PVE-СЕРВЕРЫ",
    content: (
      <Box borderRadius="20px" border="solid #80BFFF" borderWidth={{xl: "6px", base: "4px"}} p={{xl: "8px", base: "4px"}} fontFamily="heading" fontSize={"sm"} lineHeight="1ew" letterSpacing="wide">
        <Text color="#80BFFF" fontWeight="bold" mb={2}>6. ТЕРРИТОРИИ НА PVE-СЕРВЕРАХ</Text>
        <Text ml={"1px"} color="white">6.1 НЕСОГЛАСОВАННОЕ СОСЕДСТВО/НАПАДЕНИЕ • 1 ДЕНЬ</Text>
        <Text ml={"1px"} color="white">6.2 ПРИСВОЕНИЕ ЧУЖИХ ТЕРРИТОРИЙ/РЕСУРСОВ • 7 ДНЕЙ</Text>
        <Text ml={"1px"} color="white">6.3 ВРЕДИТЕЛЬСТВО НА ЛЮБОЙ ТЕРРИТОРИИ • 7 ДНЕЙ</Text>
      </Box>
    )
  }
];

export const RulesBlock = () => {
  const [activeTab, setActiveTab] = useState<number>(4);

  return (
    <VStack
      w="full"
      maxW={{ xl: "1036px", base: "380px" }}
      bgGradient="linear(to-t, transparent, rgba(153, 217, 255, 0.15))"
      border="solid #80BFFF"
      borderWidth={{ xl: "6px", base: "4px" }}
      borderRadius="38px"
      p={{ base: 4, xl: 4 }}
      mt="30px"
      mb={{ xl: "100px", base: "60px" }}
      spacing={4}
      align="stretch"
      transition="all 0.45s ease-out"
    >
      <Text 
        fontSize={{ base: "xl", xl: "3xl" }} 
        fontFamily="heading" 
        fontWeight="bold" 
        textTransform="uppercase" 
        textAlign="center"
        letterSpacing="wide"
        color="#80BFFF"
      >
        ПРАВИЛА ИГРЫ
      </Text>

      <Flex direction={{ base: "column", xl: "row" }} gap={{ base: 6, xl: 8 }} w="full">
        
        {/* ЛЕВАЯ КОЛОНКА: Кнопки навигации */}
        <VStack w={{ base: "full", xl: "300px" }} spacing={3} align="stretch">
          {RULES_DATA.map((rule, index) => {
            const isActive = activeTab === index;
            return (
              <Box key={rule.title}>
                <Button
                  w="full"
                  onClick={() => setActiveTab(index)}
                  bg={isActive ? "#80BFFF" : "transparent"}
                  color={isActive ? "#3D5E7D" : "white"}
                  border="solid #80BFFF"
                  borderWidth={{ xl: "6px", base: "4px" }}
                  h={{ xl: "60px", base: "50px" }}
                  borderRadius="full"
                  fontFamily="heading"
                  fontWeight="bold"
                  fontSize={{ xl: "lg", base: "md" }}
                  transition="all 0.2s ease-out"
                  _hover={{
                    transform: "scale(0.99)",
                    // color: isActive ? "white" : "gray.200",
                    borderColor: !isActive ? "white" : "transparent"
                  }}
                  _active={{
                    transform: "scale(0.97)"
                  }}
                >
                  {rule.title}
                </Button>

                {/* РАСКРЫВАЮЩИЙСЯ ТЕКСТ (Аккордеон) ДЛЯ МОБИЛЬНЫХ (< xl) */}
                <Box display={{ base: "block", xl: "none" }}>
                  <Collapse in={isActive} animateOpacity>
                    <Box pt={4} pb={2} px={2}>
                      {rule.content}
                    </Box>
                  </Collapse>
                </Box>
              </Box>
            );
          })}
        </VStack>

        {/* ПРАВАЯ КОЛОНКА: Контент для ПК и Техподдержка */}
        <Flex flex="1" direction="column" justify="space-between" minH={{ xl: "300px" }}>
          
          {/* Блок с текстом правила (Скрыт на мобильных, виден от xl) */}
          <Box display={{ base: "none", xl: "block" }} flex="1" mb={6}>
            {RULES_DATA[activeTab].content}
          </Box>

          {/* Блок Технической поддержки
          <Box 
            border="solid #80BFFF" 
            borderWidth={{ xl: "6px", base: "4px" }}
            borderRadius="38px" 
            p={{ base: 4, xl: 4 }}
          >
            <Text 
              textAlign="center"
              bg="transparent"
              color="#80BFFF" 
              fontFamily="heading" 
              fontSize={{ base: "lg", xl: "2xl" }} 
              fontWeight="bold"
              mb={4}
            >
              ТЕХНИЧЕСКАЯ ПОДДЕРЖКА
            </Text>
            
            <HStack spacing={{ base: 3, xl: 4 }} justify="center">
              <Button
                as="a"
                href="https://discord.com/invite/SJpQDQcJvG"
                target="_blank"
                rel="noopener noreferrer"
                bg="#80BFFF"
                color="#3D5E7D"
                flex="1"
                h={{ xl: "50px", base: "45px" }}
                borderRadius="20px"
                fontFamily="heading"
                fontWeight="bold"
                fontSize={{ xl: "lg", base: "sm" }}
                transition="all 0.2s ease-out"
                _hover={{ transform: "scale(0.99)", color: "white" }}
                _active={{ transform: "scale(0.97)" }}
              >
                DISCORD
              </Button>

              <Button
                as="a"
                href="https://t.me/revizemc"
                target="_blank"
                rel="noopener noreferrer"
                bg="#80BFFF"
                color="#3D5E7D"
                flex="1"
                h={{ xl: "50px", base: "45px" }}
                borderRadius="20px"
                fontFamily="heading"
                fontWeight="bold"
                fontSize={{ xl: "lg", base: "sm" }}
                transition="all 0.2s ease-out"
                _hover={{ transform: "scale(0.99)", color: "white" }}
                _active={{ transform: "scale(0.97)" }}
              >
                TELEGRAM
              </Button>
            </HStack>
          </Box> */}

        </Flex>

      </Flex>
    </VStack>
  );
};