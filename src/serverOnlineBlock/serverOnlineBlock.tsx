import { Box, Text, VStack, HStack, Flex, SimpleGrid, Image } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

// Заглушка иконки
import onlineLogo from './images/onlineLogo.png'; 

// Временные данные
const MOCK_SERVERS = [
  { id: 'SUNSET', name: 'SUNSET', desc: "Реалистичное выживание: погодные явления, жажда воды и многое другое", players: 1 },
  { id: 'CLASSIC', name: 'CLASSIC', desc: "Дополненное выживание: телепортации, торговля и ежедневные задания",  players: 0},
  { id: 'OCEAN', name: 'OCEAN', desc: "Реалистичное выживание: погодные явления, жажда воды и многое другое", players: 3 }
];
  
const MOCK_TOTAL = MOCK_SERVERS.reduce((sum, val) => sum + val.players, 0);

// Вспомогательная функция для правильного склонения русских слов
const getPlural = (number: number, words: string[]) => {
  const cases = [2, 0, 1, 1, 1, 2];
  return words[
    number % 100 > 4 && number % 100 < 20 
      ? 2 
      : cases[number % 10 < 5 ? number % 10 : 5]
  ];
};

export const ServerOnlineBlock = () => {
  const [onlineData, setOnlineData] = useState({ MOCK_SERVERS, MOCK_TOTAL });

  return (
    <>
      {/* Добавляем глобальную CSS-анимацию для мигающей точки */}
      <style>
        {`
          @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.1; }
            100% { opacity: 1; }
          }
        `}
      </style>

      <VStack
        w="full"
        maxW={{ xl: "1300px", base: "370px" }}
        bgGradient="linear(to-t, transparent, rgba(153, 217, 255, 0.15))"
        border="solid #80BFFF"
        borderWidth={{ xl: "6px", base: "4px" }}
        borderRadius="25px"
        p={4}
        mt="15px"
        spacing={4}
        align="stretch"
        transition="all 0.45s ease-out"
      >
        {/* Шапка блока */}
        <HStack alignItems="center" p="0px">
          <Box w={{ xl: "36px", base: "27px" }} h={{ xl: "36px", base: "27px" }}>
            <Image src={onlineLogo} alt="Онлайн" fit="fill" draggable={false} userSelect="none" />    
          </Box>
          <Text fontSize={{ base: "xl", xl: "3xl" }} fontFamily="heading" color="#80BFFF" lineHeight={"1"}>
            В СЕТИ {onlineData.MOCK_TOTAL} {getPlural(onlineData.MOCK_TOTAL, ['ИГРОК', 'ИГРОКА', 'ИГРОКОВ'])}
          </Text>
        </HStack>

        {/* Сетка режимов */}
        <SimpleGrid 
          columns={{ base: 1, xl: 3 }} 
          spacing={{ base: 4, xl: 6 }} 
          w="full"
        >
          {onlineData.MOCK_SERVERS.map((server) => (
            <Flex
              key={server.id}
              direction="column"
              alignItems="center" // Выравниваем весь контент карточки по центру
              bg="transparent"
              border="solid #80BFFF"
              borderWidth={{ xl: "6px", base: "4px" }}
              borderRadius="20px"
              p={4} // Немного увеличил отступ для красоты
              transition="all 0.45s ease-in-out"
            >
              
              {/* ВЕРХНЯЯ СТРОКА: Название (слева) и Онлайн (справа) */}
              <Flex w="full" justifyContent="space-between" alignItems="center" mb={3}>
                <Text 
                  color="#80BFFF" 
                  fontFamily="heading" 
                  fontSize={{ base: "xl", xl: "2xl" }} 
                  fontWeight="bold"
                  lineHeight="1"
                >
                  {server.name}
                </Text>
                
                <HStack spacing={2} alignItems="center">
                  <Text 
                    color="#80BFFF" 
                    fontFamily="heading" 
                    fontSize={{ base: "xl", xl: "2xl" }} 
                    fontWeight="bold"
                    lineHeight="1"
                  >
                    {server.players}
                  </Text>
                  
                  {/* Мигающая точка */}
                  <Box 
                    w="10px" 
                    h="10px" 
                    borderRadius="3px" 
                    bg="#80BFFF" 
                    animation="blink 1.5s infinite" // Подключили анимацию
                  />
                </HStack>
              </Flex>

              {/* НИЖНИЙ БЛОК: Описание */}
              <Box w="full" display="flex" justifyContent="center">
                <Text 
                  w="full"
                  color="white" 
                  fontFamily="heading" 
                  fontSize={{ base: "md", xl: "lg" }} 
                  textAlign="left" // Выравниваем текст по левому краю внутри центрированного блока
                  lineHeight="1.2"
                >
                  {server.desc}
                </Text>
              </Box>

            </Flex>
          ))}
        </SimpleGrid>
      </VStack>
    </>
  );
};