import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";

import mediaLogo from "./images/media.png";

const MAIN_COLOR = "#FF8080";
const BORDER_RADIUS = "15px";
const BORDER_WIDTH = { xl: "6px", base: "4px" };

const BENEFITS = [
  "РАЗРАБОТКА СЕРВЕРА ДЛЯ ВИДЕО",
  "ОБЩЕНИЕ С КОМАНДОЙ АВТОРОВ",
  "ОБМЕН АКТИВНОЙ АУДИТОРИЕЙ",
];

export const MediaBlock = () => {
  const handleJoinClick = () => {
    window.open("https://t.me/revizemc?direct", "_blank");
  };

  return (
    <VStack
      align="stretch"
      w="full"
      maxW={{ xl: "635px", base: "370px" }}
      mt={{ xl: "30px", base: "15px" }}
      p={4}
      border="solid #FF8080"
      borderWidth={BORDER_WIDTH}
      borderRadius="25px"
      bgGradient="linear(to-t, transparent, rgba(255, 128, 128, 0.15))"
      transition="all 0.45s ease-out"
    >
      <HStack spacing={3}>
        <Image
          src={mediaLogo}
          alt="Медийная команда"
          boxSize={{ xl: "36px", base: "27px" }}
          objectFit="fill"
          draggable={false}
          userSelect="none"
        />

        <Text
          color={MAIN_COLOR}
          fontFamily="heading"
          fontSize={{ xl: "3xl", base: "xl" }}
        >
          МЕДИЙНАЯ КОМАНДА
        </Text>
      </HStack>

      <VStack align="start" maxW="full">
        <Text
          display={{ base: "none", xl: "block" }}
          color="white"
          fontFamily="heading"
          fontSize={{ xl: "20px", base: "13px" }}
          lineHeight="1.2"
        >
          ПОМОГАЕМ НАЧИНАЮЩИМ АВТОРАМ ВЫЙТИ
          <br />
          НА НОВЫЙ УРОВЕНЬ КАЧЕСТВА КОНТЕНТА
        </Text>

        <Text
          display={{ base: "block", xl: "none" }}
          color="white"
          fontFamily="heading"
          fontSize="13px"
          lineHeight="1.2"
        >
          ПОМОГАЕМ НАЧИНАЮЩИМ АВТОРАМ
          <br />
          ВЫЙТИ НА НОВЫЙ УРОВЕНЬ КАЧЕСТВА
        </Text>
      </VStack>

      <Flex
        w="full"
        direction="column"
        align="initial"
        justify="space-between"
        gap={4}
      >
        <VStack align="start" spacing={2} flex="1" minW={0}>
          {BENEFITS.map((benefit) => (
            <HStack key={benefit} spacing={{ xl: 4, base: 2.5 }}>
              <Box
                boxSize={{ xl: "12px", base: "8px" }}
                bg={MAIN_COLOR}
                borderRadius={{ xl: "3px", base: "2px" }}
                flexShrink={0}
              />

              <Text
                color="white"
                fontFamily="heading"
                fontSize={{ xl: "20px", base: "14px" }}
                lineHeight="1.2"
              >
                {benefit}
              </Text>
            </HStack>
          ))}
        </VStack>

        <Button
          w="full"
          flexShrink={0}
          h="50px"
          borderRadius={BORDER_RADIUS}
          bg={MAIN_COLOR}
          color="#592828"
          fontFamily="heading"
          fontSize={{ xl: "20px", base: "13px" }}
          transition="all 0.3s ease-out"
          onClick={handleJoinClick}
          _hover={{ transform: "scale(0.96)" }}
          _active={{ transform: "scale(0.9)" }}
        >
          ПРИСОЕДИНИТЬСЯ
        </Button>
      </Flex>
    </VStack>
  );
};
