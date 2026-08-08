import {
  Box,
  Text,
  VStack,
  HStack,
  Flex,
  Image,
} from '@chakra-ui/react';

// Тебе понадобится добавить иконку для этого блока по аналогии с buyingLogo
import sponsorsLogo from "./images/sponsorLogo.png"; 

// Временные данные для демонстрации
const TOP_SPONSORS = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  nickname: "WWWWWWWWWWWWWWWW",
  amount: "1 000 000"
}));

export const SponsorsBlock = () => {
  return (
    <VStack
      w="full"
      maxW={{xl: "800px", base: "370px"}}
      bgGradient="linear(to-t, transparent, rgba(128, 255, 128, 0.15))"
      border="solid #80ff80"
      borderWidth={{xl: "6px", base: "4px"}}
      borderRadius="25px"
      p={4}
      mt="15px"
      align="stretch"
      transition="all 0.45s ease-out"
    >
      {/* Шапка блока */}
      <HStack alignItems="center" p="0px">
        <Box w={{ xl: "36px", base: "27px" }} h={{ xl: "36px", base: "27px" }}>
          <Image src={sponsorsLogo} alt="Спонсоры" fit="fill" draggable={false} userSelect="none" />    
        </Box>
        <Text fontSize={{ base: "xl", xl: "3xl" }} fontFamily="heading" color="#80ff80" lineHeight={"1"}>
          СПОНСОРЫ ПРОЕКТА
        </Text>
      </HStack>

      {/* Список спонсоров */}
      <VStack align="stretch" spacing={0} w="full">
        {TOP_SPONSORS.map((sponsor, index) => {
          // Определяем, последняя ли это строка (чтобы убрать нижнюю полоску)
          const isLast = index === TOP_SPONSORS.length - 1;

          return (
            <Flex
              key={sponsor.id}
              justify="space-between"
              align="center"
              py= {1}
              // Полупрозрачная синяя линия между строками
              borderBottom={isLast ? "none" : "1px solid rgba(128, 191, 255, 0.2)"}
            >
              <HStack spacing={4}>
                <Text 
                  color="#80ff80" 
                  fontFamily="heading" 
                  fontWeight="bold" 
                  fontSize={{ base: "md", xl: "lg" }}
                  w="28px" 
                  textAlign="center"
                >
                  {sponsor.id}
                </Text>
                <Text color="white" fontFamily="body" fontSize={{ base: "md", xl: "lg" }}>
                  {sponsor.nickname}
                </Text>
              </HStack>
              <Text color="#80ff80" fontFamily="heading" fontWeight="bold" fontSize={{ base: "md", xl: "lg" }}>
                {sponsor.amount}
              </Text>
            </Flex>
          );
        })}
      </VStack>
    </VStack>
  );
};