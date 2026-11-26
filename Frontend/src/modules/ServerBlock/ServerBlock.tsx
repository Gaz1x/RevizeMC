import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";

const MOBILE_TRANSITION_MS = 500;
const AUTOPLAY_MS = 5000;

const SERVER_CONFIG = [
  {
    id: "sunset",
    name: "SUNSET",
    desc: (
      <>Реалистичное выживание <br /> с природными явлениями</>
    ),
    hoverColor: "255, 128, 255",
  },
  {
    id: "modest",
    name: "MODEST",
    desc: (
      <>Выживание в свободном<br />мире без лишних правил</>
    ),
    hoverColor: "255, 191, 64",
  },
  {
    id: "oceans",
    name: "OCEANS",
    desc: (
      <>Выживание в бесконечном<br />океане с битвами за плоты</>
    ),
    hoverColor: "64, 217, 217",
  },
];

const getPlayersWord = (count: number) => {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod100 >= 11 && mod100 <= 14) return "игроков";
  if (mod10 === 1) return "игрок";
  if (mod10 >= 2 && mod10 <= 4) return "игрока";

  return "игроков";
};

type OnlineResponse = {
  total?: number;
  servers?: Array<{
    id: string;
    players: number;
  }>;
};

export const ServerBlock = () => {
  const [servers, setServers] = useState(() =>
    SERVER_CONFIG.map((server) => ({ ...server, players: 0 })),
  );
  const [totalOnline, setTotalOnline] = useState(0);

  // Состояние мобильной карусели
  const [mobilePage, setMobilePage] = useState(0);
  const [isMobileVisible, setIsMobileVisible] = useState(true);

  const mobilePageRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // Загрузка онлайна
  useEffect(() => {
    let isMounted = true;

    const fetchOnline = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        const response = await fetch("https://api.revizemc.net/online", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Ошибка сервера");
        }

        const data: OnlineResponse = await response.json();

        if (!isMounted) return;

        if (typeof data.total === "number") {
          setTotalOnline(data.total);
        }

        if (Array.isArray(data.servers)) {
          setServers((prevServers) =>
            prevServers.map((server) => {
              const updatedServer = data.servers?.find(
                (item) => item.id.toLowerCase() === server.id.toLowerCase(),
              );

              return updatedServer
                ? { ...server, players: updatedServer.players }
                : server;
            }),
          );
        }
      } catch (error) {
        if (
          error instanceof Error &&
          error.name !== "AbortError" &&
          isMounted
        ) {
          console.error("Ошибка при получении онлайна:", error);
        }
      } finally {
        clearTimeout(timeoutId);
      }
    };

    void fetchOnline();
    const intervalId = setInterval(() => void fetchOnline(), 10_000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  // Переключение страницы мобильной карусели с анимацией
  const goToPage = useCallback((newPage: number) => {
    if (
      isTransitioningRef.current ||
      newPage === mobilePageRef.current ||
      newPage < 0 ||
      newPage >= SERVER_CONFIG.length
    ) {
      return;
    }

    isTransitioningRef.current = true;
    setIsMobileVisible(false);

    transitionTimeoutRef.current = setTimeout(() => {
      mobilePageRef.current = newPage;
      setMobilePage(newPage);
      setIsMobileVisible(true);

      transitionTimeoutRef.current = setTimeout(() => {
        isTransitioningRef.current = false;
      }, MOBILE_TRANSITION_MS);
    }, MOBILE_TRANSITION_MS);
  }, []);

  // Автопролистывание. Таймер перезапускается при каждой смене страницы,
  // поэтому ручное нажатие на точку тоже сбрасывает отсчёт.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      goToPage((mobilePage + 1) % SERVER_CONFIG.length);
    }, AUTOPLAY_MS);

    return () => clearTimeout(timeoutId);
  }, [mobilePage, goToPage]);

  // Очистка таймера перехода при размонтировании
  useEffect(
    () => () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    },
    [],
  );

  const mobileServer = servers[mobilePage];
  const mobileColor = `rgb(${mobileServer.hoverColor})`;

  return (
    <>
      <style>
        {`
          @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.1; }
            100% { opacity: 1; }
          }
        `}
      </style>

      {/* Десктоп: сетка из трёх карточек */}
      <SimpleGrid
        display={{ base: "none", xl: "grid" }}
        columns={{ base: 1, xl: 3 }}
        spacing={{ base: "15px", xl: "30px" }}
        w="full"
        maxW={{ base: "370px", xl: "1300px" }}
        mt={{ base: "15px", xl: "30px" }}
        mx="auto"
        transition="all 0.3s ease-out"
      >
        {servers.map((server) => {
          const color = `rgb(${server.hoverColor})`;

          return (
            <Flex
              key={server.id}
              role="group"
              position="relative"
              overflow="hidden"
              direction="column"
              justifyContent="space-between"
              h="full"
              border="solid"
              borderColor={color}
              borderWidth="6px"
              borderRadius="20px"
              p={4}
              transition="border-color 0.3s ease-in-out"
              _before={{
                content: '""',
                position: "absolute",
                inset: "0px",
                zIndex: 0,
                pointerEvents: "none",
                borderRadius: "10px",
                bgGradient: `linear(to-t, transparent, rgba(${server.hoverColor}, 0.15))`,
                opacity: 1,
                transition: "opacity 0.3s ease-in-out",
              }}
              _after={{
                content: '""',
                position: "absolute",
                inset: "0px",
                zIndex: 0,
                pointerEvents: "none",
                borderRadius: "10px",
                bg: `rgb(${server.hoverColor})`,
                opacity: 0,
                transition: "opacity 0.3s ease-in-out",
              }}
              _hover={{
                borderColor: color,
                _before: { opacity: 0 },
                _after: { opacity: 0.25 },
              }}
            >
              <Box position="relative" zIndex={1}>
                <Text
                  color={color}
                  fontFamily="heading"
                  fontSize="2xl"
                  lineHeight="1.2"
                  mb={3}
                  transition="color 0.3s ease-in-out"
                  _groupHover={{ color }}
                >
                  {server.name}
                </Text>

                <Text
                  w="full"
                  color="white"
                  fontFamily="heading"
                  fontSize="lg"
                  textAlign="left"
                  lineHeight="1.2"
                  mb={4}
                >
                  {server.desc}
                </Text>
              </Box>

              <Text
                position="relative"
                zIndex={1}
                w="full"
                color={color}
                fontFamily="heading"
                fontSize="lg"
                lineHeight="1"
                textAlign="right"
                transition="color 0.3s ease-in-out"
                _groupHover={{ color }}
              >
                {server.players} {getPlayersWord(server.players)}
              </Text>
            </Flex>
          );
        })}
      </SimpleGrid>

      {/* Мобильная версия: карусель с анимацией и точками внутри карточки */}
      <Flex
        display={{ base: "flex", xl: "none" }}
        direction="column"
        w="full"
        maxW="370px"
        mt="15px"
        mx="auto"
      >
        <Flex
          position="relative"
          overflow="hidden"
          direction="column"
          justifyContent="space-between"
          w="full"
          border="solid"
          borderColor={mobileColor}
          borderWidth="4px"
          borderRadius="20px"
          p={2.5}
          transition={`border-color ${MOBILE_TRANSITION_MS}ms ease-in-out`}
          _before={{
            content: '""',
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            borderRadius: "10px",
            bgGradient: `linear(to-t, transparent, rgba(${mobileServer.hoverColor}, 0.15))`,
            opacity: isMobileVisible ? 1 : 0,
            transition: `opacity ${MOBILE_TRANSITION_MS}ms ease-in-out`,
          }}
        >
          {/* Точки страниц в правом верхнем углу карточки */}
          <Flex
            position="absolute"
            top="10px"
            right="12px"
            zIndex={2}
            gap="8px"
            align="center"
            h="8px"
          >
            {SERVER_CONFIG.map((server, index) => (
              <Box
                key={server.id}
                w="8px"
                h="8px"
                border="none"
                borderRadius="50%"
                bg={index === mobilePage ? mobileColor : "white"}
                transition={`background-color ${MOBILE_TRANSITION_MS}ms ease-in-out`}
              />
            ))}
          </Flex>

          <Box
            position="relative"
            zIndex={1}
            opacity={isMobileVisible ? 1 : 0}
            transition={`opacity ${MOBILE_TRANSITION_MS}ms ease-in-out`}
          >
            <Text
              color={mobileColor}
              fontFamily="heading"
              fontSize="xl"
              lineHeight="1.2"
              mb={3}
              pr="48px"
              transition={`color ${MOBILE_TRANSITION_MS}ms ease-in-out`}
            >
              {mobileServer.name}
            </Text>

            <Text
              w="full"
              color="white"
              fontFamily="heading"
              fontSize="17px"
              textAlign="left"
              lineHeight="1.2"
              mb={4}
            >
              {mobileServer.desc}
            </Text>
          </Box>

          <Text
            position="relative"
            zIndex={1}
            w="full"
            color={mobileColor}
            fontFamily="heading"
            fontSize="17px"
            lineHeight="1"
            textAlign="right"
            opacity={isMobileVisible ? 1 : 0}
            transition={`opacity ${MOBILE_TRANSITION_MS}ms ease-in-out, color ${MOBILE_TRANSITION_MS}ms ease-in-out`}
          >
            {mobileServer.players} {getPlayersWord(mobileServer.players)}
          </Text>
        </Flex>
      </Flex>
    </>
  );
};
