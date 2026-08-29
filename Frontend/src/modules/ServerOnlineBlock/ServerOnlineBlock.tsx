import { 
  Box, 
  Text, 
  VStack, 
  HStack, 
  Flex, 
  SimpleGrid, 
  Image,
  useBreakpointValue
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

import onlineLogo from './images/online.png'; 

/* КОНФИГУРАЦИЯ СЕРВЕРОВ (Статичные данные) */

export const ServerOnlineBlock = () => {
  const isDesktop = useBreakpointValue({ base: false, xl: true });

  const SERVER_CONFIG = [
    { 
      id: 'sunset', 
      name: 'SUNSET', 
      desc: <>погодные явления, жажда{!isDesktop && <br />} воды и температура тела</>, 
      color: "#ffcdff"
    },
    { 
      id: 'classic', 
      name: 'CLASSIC', 
      desc: <>свободный мир без правил, {!isDesktop && <br />} соревнования и торговля</>,  
      color: "#ffe2c0"
    },
    { 
      id: 'oceans', 
      name: 'OCEANS', 
      // Обрати внимание: нет кавычек, используются <> и </>
      desc: <>развитие  в открытом море, {!isDesktop && <br />} жажда воды и температура</>, 
      color: "#c0eded"
    }
  ];
  // Изначально ставим всем серверам онлайн 0
  const [servers, setServers] = useState(
    SERVER_CONFIG.map(config => ({ ...config, players: 0 }))
  );
  const [totalOnline, setTotalOnline] = useState(0);

  // Логика получения данных с бекенда
  useEffect(() => {
    const fetchOnline = () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // Таймаут 5 сек

      fetch('https://api.revizemc.net/online', { signal: controller.signal })
        .then(res => {
          if (!res.ok) throw new Error("Ошибка сервера");
          return res.json();
        })
        .then(data => {
          // data.total - общий онлайн со всех серверов
          // data.servers - массив онлайна по режимам [{ id: 'SUNSET', players: 15 }, ...]
          
          setTotalOnline(data.total);
          
          // Обновляем количество игроков в наших красивых карточках
          setServers(prevServers => 
            prevServers.map(server => {
              // Ищем совпадение по ID, игнорируя регистр (SUNSET === sunset)
              const updatedData = data.servers.find(
                (s: any) => s.id.toLowerCase() === server.id.toLowerCase()
              );
              return updatedData ? { ...server, players: updatedData.players } : server;
            })
          );
        })
        .catch(error => {
          if (error.name !== 'AbortError') {
            console.error("Ошибка при получении онлайна:", error);
          }
        })
        .finally(() => {
          clearTimeout(timeoutId);
        });
    };

    // 1. Делаем первый запрос сразу при загрузке страницы
    fetchOnline();

    // 2. Запускаем фоновое обновление каждые 10 секунд
    const intervalId = setInterval(fetchOnline, 10000);

    // Очищаем таймер, если компонент удаляется с экрана
    return () => clearInterval(intervalId);
  }, []);

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
        mt={{xl: "30px", base: "15px"}} 
        spacing={4}
        align="stretch"
        transition="all 0.45s ease-out"
      >
        {/* ШАПКА БЛОКА */}
        <Flex 
          w="full" 
          justifyContent="space-between" 
          alignItems="center" 
          p="0px"
        >
          {/* ЛЕВАЯ ЧАСТЬ: ЛОГОТИП И НАЗВАНИЕ */}
          <HStack spacing={{ base: 2, xl: 3 }}>
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
              НАШИ РЕЖИМЫ
            </Text>
          </HStack>

          {/* ПРАВАЯ ЧАСТЬ: ОБЩИЙ ОНЛАЙН И ТОЧКА */}
          <HStack spacing={2} alignItems="center">
            <Text 
              fontSize={{ base: "xl", xl: "3xl" }} 
              fontFamily="heading" 
              color="#80BFFF" 
              lineHeight="1"
              fontWeight="bold"
            >
              {totalOnline}
            </Text>
            <Box 
              w="10px" 
              h="10px" 
              borderRadius="3px" 
              bg="#80BFFF"
              animation="blink 1.5s infinite"
            />
          </HStack>
        </Flex>

        {/* СЕТКА РЕЖИМОВ */}
        <SimpleGrid 
          columns={{ base: 1, xl: 3 }} 
          spacing={{ base: 4, xl: 6 }} 
          w="full"
        >
          {servers.map((server) => (
            <Flex
              key={server.id}
              direction="column"
              alignItems="center"
              bg="transparent"
              border="solid"
              borderColor={server.color}
              borderWidth={{ xl: "6px", base: "4px" }}
              borderRadius="20px"
              p={{xl: 4, base: 2.5}}
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
                  color={server.color} 
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
                    color={server.color}
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
                    bg={server.color}
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
                  fontSize={{ base: "15px", xl: "lg" }} 
                  textAlign="left"
                  lineHeight="1"
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