import {
  Box,
  Text,
  VStack,
  HStack,
  Flex,
  SimpleGrid,
  Image,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

const getPlayersWord = (count: number) => {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod100 >= 11 && mod100 <= 14) {
    return "игроков";
  }
  if (mod10 === 1) {
    return "игрок";
  }
  if (mod10 >= 2 && mod10 <= 4) {
    return "игрока";
  }
  return "игроков";
};

export const ServerBlock = () => {
  const isDesktop = useBreakpointValue({ base: false, xl: true });

  const SERVER_CONFIG = [
    {
      id: "sunset",
      name: "SUNSET",
      desc: (
        <>
          Реалистичное выживание <br /> с динамичными ивентами
        </>
      ),
      color: "255, 205, 255",
      hoverColor: "255, 128, 255",
    },
    {
      id: "classic",
      name: "CLASSIC",
      desc: (
        <>
          Выживание в свободном <br /> мире без лишних правил
        </>
      ),
      color: "255, 226, 192",
      hoverColor: "255, 191, 64",
    },
    {
      id: "oceans",
      name: "OCEANS",
      desc: <>Выживание в бесконечном океане с битвами за плоты</>,
      color: "192, 237, 237",
      hoverColor: "64, 217, 217",
    },
  ];

  const [servers, setServers] = useState(
    SERVER_CONFIG.map((config) => ({ ...config, players: 0 })),
  );
  const [totalOnline, setTotalOnline] = useState(0);

  useEffect(() => {
    const fetchOnline = () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      fetch("https://api.revizemc.net/online", { signal: controller.signal })
        .then((res) => {
          if (!res.ok) throw new Error("Ошибка сервера");
          return res.json();
        })
        .then((data) => {
          setTotalOnline(data.total);
          setServers((prevServers) =>
            prevServers.map((server) => {
              const updatedData = data.servers.find(
                (s: any) => s.id.toLowerCase() === server.id.toLowerCase(),
              );
              return updatedData
                ? { ...server, players: updatedData.players }
                : server;
            }),
          );
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            console.error("Ошибка при получении онлайна:", error);
          }
        })
        .finally(() => {
          clearTimeout(timeoutId);
        });
    };

    fetchOnline();
    const intervalId = setInterval(fetchOnline, 10000);
    return () => clearInterval(intervalId);
  }, []);

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

      <SimpleGrid
        columns={{ base: 1, xl: 3 }}
        spacing={{ base: 4, xl: 4 }}
        w="full"
        maxW={{ xl: "1300px", base: "370px" }}
        mt={{ xl: "30px", base: "15px" }}
        mx="auto"
        transition="all 0.45s ease-out"
      >
        {servers.map((server) => (
          <Flex
            key={server.id}
            role="group"
            direction="column"
            justifyContent="space-between"
            h="full"
            border="solid"
            borderColor={`rgb(${server.hoverColor})`}
            borderWidth={{ xl: "6px", base: "4px" }}
            borderRadius="20px"
            p={{ xl: 4, base: 2.5 }}
            transition="all 0.3s ease-in-out"
            _hover={{
              borderColor: `rgb(${server.hoverColor})`,
              bg: `rgba(${server.hoverColor}, 0.25)`,
            }}
          >
            <Box>
              <Flex w="full" mb={3}>
                <Text
                  color={`rgb(${server.hoverColor})`}
                  fontFamily="heading"
                  fontSize={{ base: "xl", xl: "2xl" }}
                  lineHeight="1.2"
                  _groupHover={{ color: `rgb(${server.hoverColor})` }}
                  transition="all 0.3s ease-in-out"
                >
                  {server.name}
                </Text>
              </Flex>

              <Box w="full" display="flex" mb={4}>
                <Text
                  w="full"
                  color="white"
                  fontFamily="heading"
                  fontSize={{ base: "17px", xl: "lg" }}
                  textAlign="left"
                  lineHeight="1.2"
                >
                  {server.desc}
                </Text>
              </Box>
            </Box>

            <Flex w="full" justifyContent="flex-end">
              <Text
                color={`rgb(${server.hoverColor})`}
                fontFamily="heading"
                fontSize={{ base: "xl", xl: "lg" }}
                lineHeight="1"
                transition="all 0.3s ease-in-out"
                _groupHover={{ color: `rgb(${server.hoverColor})` }}
              >
                {server.players} {getPlayersWord(server.players)}
              </Text>
            </Flex>
          </Flex>
        ))}
      </SimpleGrid>
    </>
  );
};
