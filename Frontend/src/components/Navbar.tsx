import {
  Image,
  Box,
  Text,
  Flex,
  Container,
  useClipboard,
  useBreakpointValue,
  Button,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import logo from "./images/logo.png";
import { playSuccessSound } from "../utils/playSound";

type OnlineResponse = {
  total?: number;
  servers?: Array<{
    id: string;
    players: number;
  }>;
};

const getPlayersWord = (count: number) => {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod100 >= 11 && mod100 <= 14) return "игроков";
  if (mod10 === 1) return "игрок";
  if (mod10 >= 2 && mod10 <= 4) return "игрока";

  return "игроков";
};

interface NavbarProps {
  recordBoxWidth?: { base?: string; xl?: string };
}

export const Navbar = ({ recordBoxWidth = { base: "140px", xl: "396px" } }: NavbarProps) => {
  const { onCopy } = useClipboard("revizemc.net");

  const [isAnimating, setIsAnimating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [totalPlayers, setTotalPlayers] = useState(0);

  const isDesktop = useBreakpointValue({ base: false, xl: true });

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

        if (typeof data.total === "number" && Number.isFinite(data.total)) {
          setTotalPlayers(data.total);
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



  const handleCopy = () => {
    if (!isDesktop || isAnimating) return;

    onCopy();

    playSuccessSound();

    setIsAnimating(true);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);

    setTimeout(() => {
      setIsAnimating(false);
    }, 1800);
  };

  return (
    <Flex
      direction="column"
      alignItems="center"
      w="full"
      maxW={{ xl: "1300px", base: "370px" }}
    >
      <Flex
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={0}
        mt={{ xl: "30px", base: "15px" }}
        w="full"
      >
        <Flex
          direction="row"
          alignItems="center"
          gap={{ base: "15px", xl: 3 }}
          flex={{ xl: 1 }}
          justify={{ base: "center", xl: "flex-start" }}
        >
          <Box
            w={{ xl: "64px", base: "45px" }}
            h={{ xl: "64px", base: "45px" }}
          >
            <Image
              src={logo}
              alt="Логотип"
              fit="fill"
              draggable={false}
              userSelect="none"
            />
          </Box>

          <Container
            as="nav"
            role="group"
            display={"flex"}
            border="solid #80bFFF"
            borderWidth={{ xl: "6px", base: "4px" }}
            borderRadius={{ xl: "14px", base: "12px" }}
            w={{ xl: "320px", base: "310px" }}
            h={{ xl: "64px", base: "45px" }}
            m={0}
            p={0}
            alignItems="center"
            justifyContent="center"
            position="relative"
            cursor={isDesktop ? "pointer" : "default"}
            pointerEvents={isDesktop ? "auto" : "none"}
            onClick={handleCopy}
            transition="all 0.3s ease-in-out"
            sx={{
              "@media (hover: hover) and (pointer: fine)": {
                "&:hover": {
                  transform: "scale(0.95)",
                  border: copied ? "solid #80BFFF 6px" : "solid white 6px",
                },
                "&:active": {
                  transform: "scale(0.9)",
                },
              },
            }}
          >
            <Text
              position="absolute"
              transform={copied ? "scale(0.7)" : "scale(1)"}
              opacity={copied ? 0 : 1}
              transition="all 0.3s ease-in-out"
              fontSize={{ xl: "30px", base: "28px" }}
              bgColor={{ xl: "#FFFFFF", base: "#80bfff" }}
              bgClip="text"
              fontFamily="heading"
              lineHeight="1"
              _groupHover={{ bgColor: "#FFFFFF" }}
            >
              REVIZEMC.NET
            </Text>

            <Text
              position="absolute"
              transform={copied ? "scale(1)" : "scale(0.7)"}
              opacity={copied ? 1 : 0}
              transition="all 0.3s ease-in-out"
              fontSize={{ xl: "28px", base: "24px" }}
              bgColor="#80bFFF"
              bgClip="text"
              fontFamily="heading"
              lineHeight="1"
            >
              СКОПИРОВАНО
            </Text>
          </Container>
        </Flex>

        <Flex
          flex={{ xl: 1 }}
          justify="center"
          display={{ base: "none", xl: "flex" }}
        >
          <Box
            border="solid #80bFFF"
            borderWidth={{ xl: "6px", base: "4px" }}
            borderRadius={{ xl: "14px", base: "26px" }}
            h={{ xl: "64px", base: "54px" }}
            m={0}
            px={3}
            alignItems="center"
            justifyContent="center"
            display="flex"
          >
            <Text
              fontSize="30px"
              bgColor="#80bFFF"
              bgClip="text"
              fontFamily="body"
              lineHeight="1.2"
            >
              ИГРАЙ ПО-НОВОМУ!
            </Text>
          </Box>
        </Flex>

        <Flex
          direction="row"
          gap={{ xl: 3, base: 6 }}
          flex={{ xl: 1 }}
          justify={{ base: "center", xl: "flex-end" }}
          display={{ base: "none", xl: "flex" }}
        >
          <Box
            border="solid #80bFFF"
            borderWidth={{ xl: "6px", base: "4px" }}
            borderRadius={{ xl: "14px", base: "12px" }}
            w={recordBoxWidth}
            h={{ base: "45px", xl: "64px" }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            cursor="default"
          >
            <Text
              color="white"
              fontFamily="heading"
              fontSize={{ base: "14px", xl: "24px" }}
              lineHeight="1"
            >
              {totalPlayers} {getPlayersWord(totalPlayers)}
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};
