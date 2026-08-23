import {
  Box,
  Text,
  VStack,
  HStack,
  Flex,
  Image,
  Spinner,
  Center
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

import sponsorsLogo from "./images/sponsorLogo.png"; 

interface Sponsor {
  username: string;
  token: number;
}

export const SponsorsBlock = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Выносим логику запроса в отдельную функцию
    const fetchSponsors = () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 секунд

      fetch('http://192.168.0.9:5000/api/sponsors', { signal: controller.signal })
        .then((res) => {
          if (!res.ok) throw new Error("Сервер вернул ошибку");
          return res.json();
        })
        .then((data) => {
          setSponsors(data);
          setHasError(false); // Сбрасываем ошибку, если запрос прошел успешно
          setIsLoading(false);
        })
        .catch((error) => {
          if (error.name !== 'AbortError') {
            console.error("Сбой при загрузке спонсоров:", error);
            setHasError(true);
          }
          setIsLoading(false);
        })
        .finally(() => {
          clearTimeout(timeoutId);
        });
    };

    // 1. Делаем первый запрос сразу при загрузке страницы
    fetchSponsors();

    // 2. Запускаем таймер, который будет повторять запрос каждые 15 секунд (15000 мс)
    const intervalId = setInterval(fetchSponsors, 10000);

    // 3. Обязательно очищаем таймер, если пользователь уйдет на другую страницу,
    // чтобы запросы не продолжали лететь в фоне
    return () => clearInterval(intervalId);
  }, []);;

  return (
    <VStack
      w="full"
      maxW={{ xl: "800px", base: "370px" }}
      bgGradient="linear(to-t, transparent, rgba(128, 255, 128, 0.15))"
      border="solid #80ff80"
      borderWidth={{ xl: "6px", base: "4px" }}
      borderRadius="25px"
      p={4}
      mt="15px"
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
            src={sponsorsLogo} 
            alt="Спонсоры" 
            fit="fill" 
            draggable={false} 
            userSelect="none" 
          />    
        </Box>
        <Text 
          fontSize={{ base: "xl", xl: "3xl" }} 
          fontFamily="heading" 
          color="#80ff80" 
          lineHeight="1"
        >
          СПОНСОРЫ ПРОЕКТА
        </Text>
      </HStack>

      {/* ЛОГИКА ОТОБРАЖЕНИЯ (Загрузка / Ошибка или Пустота / Список) */}
      {isLoading ? (
        <Center 
          w="full" 
          h="150px"
        >
          <Spinner 
            color="#80ff80" 
            size="xl" 
            thickness="4px"
          />
        </Center>
      ) : hasError || sponsors.length === 0 ? (
        <Center 
          w="full" 
          h="150px"
        >
          <Text 
            color="whiteAlpha.700" 
            fontFamily="heading" 
            fontSize={{ base: "md", xl: "lg" }}
            textAlign="center"
          >
            ПОЛНАЯ ЖОПА!<br/>
            БУДЬ ПЕРВЫМ СПОНСОРОМ!
          </Text>
        </Center>
      ) : (
        <VStack 
          align="stretch" 
          spacing={0} 
          w="full"
        >
          {sponsors.map((sponsor, index) => {
            const isLast = index === sponsors.length - 1;

            return (
              <Flex
                key={sponsor.username}
                justify="space-between"
                align="center"
                py={1}
                borderBottom={isLast ? "none" : "1px solid rgba(128, 191, 255, 0.2)"}
              >
                <HStack 
                  spacing={4}
                >
                  <Text 
                    color="#80ff80" 
                    fontFamily="heading" 
                    fontWeight="bold" 
                    fontSize={{ base: "md", xl: "lg" }}
                    w="28px" 
                    textAlign="center"
                  >
                    {index + 1}
                  </Text>
                  <Text 
                    color="white" 
                    fontFamily="body" 
                    fontSize={{ base: "md", xl: "lg" }}
                  >
                    {sponsor.username}
                  </Text>
                </HStack>
                
                <Text 
                  color="#80ff80" 
                  fontFamily="heading" 
                  fontWeight="bold" 
                  fontSize={{ base: "md", xl: "lg" }}
                >
                  {sponsor.token.toLocaleString('ru-RU')}
                </Text>
              </Flex>
            );
          })}
        </VStack>
      )}
    </VStack>
  );
};