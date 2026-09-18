import {
  Box,
  Text,
  VStack,
  HStack,
  Flex,
  Image,
  SimpleGrid,
  Button,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

import mediaLogo from "./images/media.png";

export const MediaBlock = () => {
  // Цветовая схема блока
  const mainColor = "#FF8080";

  // Список преимуществ для правой колонки
  const benefits = [
    "ДЕЛИМСЯ ОПЫТОМ ВЕДЕНИЯ КАНАЛОВ",
    "РАЗРАБАТЫВАЕМ РЕЖИМЫ ДЛЯ СЪЁМОК",
    "ОБМЕНИВАЕМСЯ АКТИВНОЙ АУДИТОРИЕЙ",
  ];

  return (
    <VStack
      w="full"
      maxW={{ xl: "1300px", base: "370px" }}
      bgGradient={`linear(to-t, transparent, rgba(255, 128, 128, 0.15))`}
      border="solid"
      borderColor={mainColor}
      borderWidth={{ xl: "6px", base: "4px" }}
      borderRadius="25px"
      p={4}
      mt={{ xl: "30px", base: "15px" }}
      spacing={4}
      align="stretch"
      transition="all 0.45s ease-out"
    >
      {/* ШАПКА БЛОКА */}
      <HStack alignItems="center" spacing={3}>
        <Box w={{ xl: "36px", base: "27px" }} h={{ xl: "36px", base: "27px" }}>
          <Image
            src={mediaLogo}
            alt="Медиа"
            fit="fill"
            draggable={false}
            userSelect="none"
          />
        </Box>

        <Text
          fontSize={{ base: "xl", xl: "3xl" }}
          fontFamily="heading"
          color={mainColor}
          lineHeight="1"
        >
          МЕДИЙНАЯ ГРУППА
        </Text>
      </HStack>

      {/* ОСНОВНОЙ КОНТЕНТ (СЕТКА) */}
      <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={4} w="full">
        {/* ЛЕВАЯ КОЛОНКА (Информационная) */}
        <Flex
          direction="column"
          borderRadius="18px"
          border="solid"
          borderColor={mainColor}
          borderWidth={{ xl: "6px", base: "4px" }}
          p={4}
          justifyContent="center"
          gap={4}
        >
          <Text
            color="white"
            fontFamily="heading"
            fontSize={{ xl: "lg", base: "md" }}
            fontWeight="bold"
            lineHeight="1.2"
          >
            НАША КОМАНДА ПОДДЕРЖИВАЕТ АВТОРОВ ОРИГИНАЛЬНОГО КОНТЕНТА И СТРЕМИТСЯ
            СФОРМИРОВАТЬ АКТИВНОЕ СООБЩЕСТВО
          </Text>
          <Text
            color="white"
            fontFamily="heading"
            fontSize={{ xl: "lg", base: "md" }}
            fontWeight="bold"
            lineHeight="1.2"
          >
            НАШ КОЛЛЕКТИВ ПОМОЖЕТ ВАМ ОБРЕСТИ НОВЫЙ МАСШТАБ И ПОВЫСИТЬ ПЛАНКУ
            КАЧЕСТВА ВИДЕОРОЛИКОВ НА КАНАЛЕ
          </Text>
          <Text
            color="white"
            fontFamily="heading"
            fontSize={{ xl: "lg", base: "md" }}
            fontWeight="bold"
            lineHeight="1.2"
          >
            СОЗДАВАЙТЕ КОНТЕНТ НА НАШИХ РЕЖИМАХ ИЛИ ПРОВОДИТЕ ИВЕНТЫ, ЧТОБЫ
            ВЫЙТИ НА НОВЫЙ УРОВЕНЬ КОНТАКТА СО ЗРИТЕЛЯМИ
          </Text>
        </Flex>

        {/* ПРАВАЯ КОЛОНКА (Рамки с текстом и кнопка) */}
        <Flex
          direction="column"
          //   borderRadius="18px"
          //   border="solid"
          //   borderColor={mainColor}
          //   borderWidth={{ xl: "6px", base: "4px" }}
          //   p={4}
          gap={4} // Одинаковое расстояние между всеми рамками и кнопкой
        >
          {/* Рендерим каждую строчку в своей рамке */}
          {benefits.map((text, index) => (
            <Flex
              key={index}
              flex="1" // Растягивает рамки равномерно по доступной высоте
              alignItems="center"
              justifyContent="center"
              border="solid"
              borderColor={mainColor}
              borderWidth={{ xl: "6px", base: "4px" }}
              borderRadius="12px"
              px={4}
              py={2}
              textAlign="center"
              minH={{ xl: "50px", base: "45px" }}
            >
              <Text
                color="white"
                fontFamily="heading"
                fontSize={{ xl: "lg", base: "md" }}
                fontWeight="bold"
                lineHeight="1"
              >
                {text}
              </Text>
            </Flex>
          ))}

          {/* ГЛАВНАЯ КНОПКА */}
          <Button
            w="full"
            h={{ xl: "50px", base: "45px" }}
            flexShrink={0} // Запрещаем кнопке сжиматься
            bg={mainColor}
            color="#592828"
            // border="solid"
            // borderColor={mainColor}
            // borderWidth={{ xl: "6px", base: "4px" }}
            borderRadius="12px"
            fontFamily="heading"
            fontWeight="bold"
            fontSize={{ xl: "lg", base: "md" }}
            transition="all 0.2s ease-out"
            _hover={{
              transform: "scale(0.98)",
            }}
            _active={{
              transform: "scale(0.95)",
            }}
            onClick={() => {
              window.open("https://t.me/revizemc?direct", "_blank");
            }}
          >
            ПРИСОЕДИНИТЬСЯ
          </Button>
        </Flex>
      </SimpleGrid>
    </VStack>
  );
};
