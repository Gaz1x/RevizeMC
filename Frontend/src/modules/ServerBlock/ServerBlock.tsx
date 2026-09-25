import { Box, Text, Flex, SimpleGrid } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const SERVER_CONFIG = [
  {
    id: "sunset",
    name: "SUNSET",
    desc: (
      <>
        Реалистичное выживание <br /> с динамичными ивентами
      </>
    ),
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
    hoverColor: "255, 191, 64",
  },
  {
    id: "oceans",
    name: "OCEANS",
    desc: <>Выживание в бесконечном океане с битвами за плоты</>,
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

export const ServerBlock = () => {
  const [servers, setServers] = useState(
    SERVER_CONFIG.map((server) => ({ ...server, players: 0 })),
  );

  const [totalOnline, setTotalOnline] = useState(0);

  useEffect(() => {
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

        const data = await response.json();

        setTotalOnline(data.total);

        setServers((prevServers) =>
          prevServers.map((server) => {
            const updatedServer = data.servers.find(
              (item: { id: string }) =>
                item.id.toLowerCase() === server.id.toLowerCase(),
            );

            return updatedServer
              ? { ...server, players: updatedServer.players }
              : server;
          }),
        );
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Ошибка при получении онлайна:", error);
        }
      } finally {
        clearTimeout(timeoutId);
      }
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
              borderWidth={{ base: "4px", xl: "6px" }}
              borderRadius="20px"
              p={{ base: 2.5, xl: 4 }}
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
                  fontSize={{ base: "xl", xl: "2xl" }}
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
                  fontSize={{ base: "17px", xl: "lg" }}
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
                fontSize={{ base: "xl", xl: "lg" }}
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
    </>
  );
};
