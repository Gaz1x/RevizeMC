import {
  Box,
  Text,
  VStack,
  HStack,
  Spinner,
  usePrefersReducedMotion,
} from '@chakra-ui/react';

import { keyframes } from '@emotion/react';

import { useState, useEffect } from 'react';

// 1. Создаем красивую анимацию пульсации для индикатора онлайна
const pulseRing = keyframes`
  0% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(72, 187, 120, 0); }
  100% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(72, 187, 120, 0); }
`;

export const ServerOnlineBlock = () => {
  // Состояния для хранения данных о сервере
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [players, setPlayers] = useState<number>(0);
  const [maxPlayers, setMaxPlayers] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const prefersReducedMotion = usePrefersReducedMotion();
  const animation = prefersReducedMotion ? undefined : `${pulseRing} 2s infinite`;

  // 2. Функция для запроса данных к API
  const fetchServerStatus = async () => {
    try {
      // Запрашиваем данные у бесплатного API (замени revizemc.net на нужный IP, если требуется)
      const response = await fetch('https://api.mcsrvstat.us/3/revizemc.net');
      const data = await response.json();

      if (data.online) {
        setIsOnline(true);
        setPlayers(data.players.online);
        setMaxPlayers(data.players.max);
      } else {
        setIsOnline(false);
      }
    } catch (error) {
      console.error("Ошибка при получении статуса сервера:", error);
      setIsOnline(false);
    } finally {
      setIsLoading(false); // Выключаем спиннер загрузки
    }
  };

  // 3. Вызываем функцию при загрузке компонента и ставим таймер на обновление
  useEffect(() => {
    fetchServerStatus();

    // Обновляем данные каждую минуту (60000 мс)
    const interval = setInterval(fetchServerStatus, 60000);
    
    // Очищаем таймер при размонтировании компонента
    return () => clearInterval(interval);
  }, []);

  return (
    <VStack
      w="full"
      maxW={{ xl: "1036px", base: "370px" }}
      bgGradient="linear(to-t, transparent, rgba(153, 217, 255, 0.15))"
      border="solid #80BFFF"
      borderWidth={{ xl: "6px", base: "4px" }}
      borderRadius="30px"
      p={{ base: 6, xl: 8 }}
      mt="30px"
      spacing={4}
      align="center"
      transition="all 0.45s ease-out"
    >
      <Text 
        fontSize={{ base: "xl", xl: "3xl" }} 
        fontFamily="heading" 
        color="#80BFFF"
        lineHeight="1"
        textTransform="uppercase"
      >
        СТАТУС СЕРВЕРА
      </Text>

      {/* 4. Отображение контента в зависимости от состояния */}
      {isLoading ? (
        <Spinner color="#80BFFF" size="xl" thickness="4px" mt={4} />
      ) : (
        <HStack spacing={4} mt={2}>
          {/* Пульсирующий индикатор (Зеленый если онлайн, Красный если оффлайн) */}
          <Box
            as="div"
            h="20px"
            w="20px"
            bg={isOnline ? "green.400" : "red.400"}
            borderRadius="50%"
            animation={isOnline ? animation : undefined}
          />
          
          <Text 
            color="white" 
            fontFamily="heading" 
            fontSize={{ base: "2xl", xl: "4xl" }} 
            fontWeight="bold"
            lineHeight="1"
          >
            {isOnline ? `${players} ИЗ ${maxPlayers} ИГРОКОВ` : "ОФФЛАЙН"}
          </Text>
        </HStack>
      )}
      
      {/* Дополнительный текст */}
      <Text 
        color="gray.300" 
        fontFamily="body" 
        fontSize={{ base: "sm", xl: "md" }} 
        mt={2}
      >
        {isOnline ? "ИГРОКОВ НА СЕРВЕРЕ ПРЯМО СЕЙЧАС" : "СЕРВЕР ВРЕМЕННО НЕДОСТУПЕН"}
      </Text>
    </VStack>
  );
};