import { 
  Box, 
  Text, 
  VStack, 
  HStack, 
  Flex, 
  SimpleGrid, 
  Image 
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

import onlineLogo from './images/onlineLogo.png'; 

/* ВРЕМЕННЫЕ ДАННЫЕ */
const MOCK_SERVERS = [
  { 
    id: 'SUNSET', 
    name: 'SUNSET', 
    desc: "Реалистичное выживание: погодные явления, жажда воды и многое другое", 
    players: 1 
  },
  { 
    id: 'CLASSIC', 
    name: 'CLASSIC', 
    desc: "Дополненное выживание: телепортации, торговля и ежедневные задания",  
    players: 0
  },
  { 
    id: 'OCEAN', 
    name: 'OCEAN', 
    desc: "Реалистичное выживание: погодные явления, жажда воды и многое другое", 
    players: 3 
  }
];
  
const MOCK_TOTAL = MOCK_SERVERS.reduce((sum, val) => sum + val.players, 0);

/* ФУНКЦИЯ СКЛОНЕНИЯ СЛОВ */
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
      {/* ГЛОБАЛЬНАЯ CSS-АНИМАЦИЯ */}
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
        {/* ШАПКА БЛОКА */}
        <HStack 
          alignItems="center" 
          p="0px"
        >
          <Box 
            w={{ xl: "36px", base: "27px" }} 
            h={{ xl: "36px", base: "27px" }}
          >
            <Image 
              src={onlineLogo} 
              alt="Онлайн" 
              fit="fill" 
              draggable={false} 
              userSelect="none" 
            />    
          </Box>
          <Text 
            fontSize={{ base: "xl", xl: "3xl" }} 
            fontFamily="heading" 
            color="#80BFFF" 
            lineHeight="1"
          >
            В СЕТИ {onlineData.MOCK_TOTAL} {getPlural(onlineData.MOCK_TOTAL, ['ИГРОК', 'ИГРОКА', 'ИГРОКОВ'])}
          </Text>
        </HStack>

        {/* СЕТКА РЕЖИМОВ */}
        <SimpleGrid 
          columns={{ base: 1, xl: 3 }} 
          spacing={{ base: 4, xl: 6 }} 
          w="full"
        >
          {onlineData.MOCK_SERVERS.map((server) => (
            <Flex
              key={server.id}
              direction="column"
              alignItems="center"
              bg="transparent"
              border="solid #80BFFF"
              borderWidth={{ xl: "6px", base: "4px" }}
              borderRadius="20px"
              p={4}
              transition="all 0.45s ease-in-out"
            >
              
              {/* ВЕРХНЯЯ СТРОКА: НАЗВАНИЕ И ОНЛАЙН */}
              <Flex 
                w="full" 
                justifyContent="space-between" 
                alignItems="center" 
                mb={3}
              >
                <Text 
                  color="#80BFFF" 
                  fontFamily="heading" 
                  fontSize={{ base: "xl", xl: "2xl" }} 
                  fontWeight="bold"
                  lineHeight="1"
                >
                  {server.name}
                </Text>
                
                <HStack 
                  spacing={2} 
                  alignItems="center"
                >
                  <Text 
                    color="#80BFFF" 
                    fontFamily="heading" 
                    fontSize={{ base: "xl", xl: "2xl" }} 
                    fontWeight="bold"
                    lineHeight="1"
                  >
                    {server.players}
                  </Text>
                  
                  {/* МИГАЮЩАЯ ТОЧКА */}
                  <Box 
                    w="10px" 
                    h="10px" 
                    borderRadius="3px" 
                    bg="#80BFFF" 
                    animation="blink 1.5s infinite"
                  />
                </HStack>
              </Flex>

              {/* НИЖНИЙ БЛОК: ОПИСАНИЕ */}
              <Box 
                w="full" 
                display="flex" 
                justifyContent="center"
              >
                <Text 
                  w="full"
                  color="white" 
                  fontFamily="heading" 
                  fontSize={{ base: "md", xl: "lg" }} 
                  textAlign="left"
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