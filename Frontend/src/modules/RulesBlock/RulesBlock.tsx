import {
  Box,
  Text,
  VStack,
  HStack,
  Flex,
  Image,
  SimpleGrid,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

import rulesLogo from "./images/rules.png";

export const RulesBlock = () => {
  // Массив правил для удобного рендеринга
  const RULES_LIST = [
    "Неприемлемый псевдоним",
    "Дополнительные аккаунты",
    "Передача доступа к аккаунту",
    "Раздражающие сообщения",
    "Оскорбительные сообщения",
    "Раскрытие личных данных",
    "Модификация обзора через препятствия",
    "Модификация боевой системы",
    "Модификация движений",
    "Дестабилизация работы сервера",
  ];

  return (
    <VStack
      transition="all 0.45s ease-out"
      w="full"
      maxW={{ xl: "1300px", base: "370px" }}
      bgGradient="linear(to-t, transparent, rgba(255, 255, 128, 0.15))"
      border="solid #ffff80"
      borderWidth={{ xl: "6px", base: "4px" }}
      borderRadius="25px"
      p={4}
      mt={{ xl: "30px", base: "15px" }}
      // spacing={4}
      align="stretch"
    >
      {/* ШАПКА БЛОКА */}
      <HStack alignItems="center" spacing={3}>
        <Box w={{ xl: "36px", base: "27px" }} h={{ xl: "36px", base: "27px" }}>
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
          ПРАВИЛА СЕРВЕРА
        </Text>
      </HStack>

      {/* ОСНОВНОЙ БЛОК С ТЕКСТОМ */}
      <Box
        w="full"
        px={{ xl: 4, base: 3 }}
        py={3}
        fontFamily="heading"
        mt="5px"
      >
        {/* СПИСОК ПРАВИЛ */}
        <SimpleGrid columns={{ base: 1, xl: 2 }} spacingY={4}>
          {RULES_LIST.map((rule, index) => (
            <Flex key={index} alignItems="flex-start" cursor="default">
              <Text
                color="#ffff80"
                fontWeight="bold"
                fontSize={{ xl: "lg", base: "13px" }}
                mr={{ xl: 5, base: 1.5 }}
                lineHeight="1"
                minW="24px"
                textAlign={"left"}
              >
                {index + 1}
              </Text>
              <Text
                color="white"
                fontSize={{ xl: "lg", base: "13px" }}
                lineHeight="1"
              >
                {rule}
              </Text>
            </Flex>
          ))}
        </SimpleGrid>
      </Box>
    </VStack>
  );
};
