import {
  Box,
  Text,
  VStack,
  HStack,
  Flex,
  Image,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

import LatestLogo from "./images/latest.png";

interface Latest {
  username: string;
  action: number;
}

export const LatestsBlock = () => {
  const [latests, setLatest] = useState<Latest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchLatests = () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      fetch("https://api.revizemc.net/latest", { signal: controller.signal })
        .then((res) => {
          if (!res.ok) throw new Error("Сервер вернул ошибку");
          return res.json();
        })
        .then((data) => {
          setLatest(data);
          setHasError(false);
          setIsLoading(false);
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            console.error("Сбой при загрузке спонсоров:", error);
            setHasError(true);
          }
          setIsLoading(false);
        })
        .finally(() => {
          clearTimeout(timeoutId);
        });
    };

    fetchLatests();

    const intervalId = setInterval(fetchLatests, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <VStack
      w="full"
      maxW={{ xl: "800px", base: "370px" }}
      bgGradient="linear(to-t, transparent, rgba(128, 255, 128, 0.15))"
      border="solid #80ff80"
      borderWidth={{ xl: "6px", base: "4px" }}
      borderRadius="25px"
      p={4}
      mt={{ xl: "30px", base: "15px" }}
      align="stretch"
    >
      <HStack alignItems="center" p="0px" spacing={3}>
        <Box w={{ xl: "36px", base: "27px" }} h={{ xl: "36px", base: "27px" }}>
          <Image
            src={LatestLogo}
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
          lineHeight="1.2"
        >
          ПОСЛЕДНИЕ ПОКУПКИ
        </Text>
      </HStack>

      {isLoading ? (
        <Center w="full" h="150px">
          <Spinner color="#80ff80" size="xl" thickness="4px" />
        </Center>
      ) : hasError || latests.length === 0 ? (
        <Center w="full" h="150px">
          <Text
            color="whiteAlpha.700"
            fontFamily="heading"
            fontSize={{ base: "md", xl: "lg" }}
            textAlign="center"
          >
            ОШИБКА
          </Text>
        </Center>
      ) : (
        <VStack align="stretch" spacing={0} w="full">
          {latests.map((latest, index) => {
            const isLast = index === latests.length - 1;

            return (
              <Flex
                key={latest.username}
                justify="space-between"
                align="center"
                py={1}
                borderBottom={
                  isLast ? "none" : "1px solid rgba(128, 255, 128, 0.2)"
                }
                pl={"13px"}
                opacity={1 - index * 0.05}
              >
                <HStack spacing={4}>
                  <Box w="10px" h="10px" borderRadius="3px" bg="#80ff80" />
                  <Text
                    color="white"
                    fontFamily="'DaysSansBlackCaps', sans-serif !important"
                    lineHeight="0.65"
                    align="center"
                    fontSize={{ base: "md", xl: "lg" }}
                  >
                    {latest.username}
                  </Text>
                </HStack>

                <Text
                  color="#80ff80"
                  fontFamily="heading"
                  fontSize={{ base: "md", xl: "lg" }}
                >
                  {latest.action} ТОКЕНОВ
                </Text>
              </Flex>
            );
          })}
        </VStack>
      )}
    </VStack>
  );
};
