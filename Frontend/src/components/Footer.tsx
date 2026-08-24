import {
  Text,
  Button,
  SimpleGrid,
  Flex,
  HStack,
  Divider,
  Box,
  Image
} from '@chakra-ui/react';

import telegram from "./images/whiteTelegram.png";

export const Footer = () => {
  return (
    <Flex
      w="full"
      maxW={{ xl: "1300px", base: "370px" }}
      bgGradient="linear(to-t, transparent, rgba(153, 217, 255, 0.15))"
      border="solid #80BFFF"
      borderWidth={{ xl: "6px", base: "4px" }}
      borderRadius={{ xl: "25px", base: "20px" }}
      p={4} 
      mt={{xl: "30px", base: "15px"}} 
      mb={{xl: "30px", base: "15px"}} 
      align="center"
      transition="all 0.45s ease-in-out"
    >

      <SimpleGrid columns={{ base: 1, xl: 3 }} spacing={4} w="full" alignItems="stretch">
        
        {/* КОЛОНКА 1: Бренд и копирайт */}
        <Flex 
          direction="column" 
          align={{ base: "center", xl: "flex-start" }} 
          justify="space-between" 
          h="full" 
          gap={{ base: 2, xl: 2 }}
        >
          {/* СТРОКА 1 */}
          <Flex h={{ xl: "40px", base: "auto" }} align="center">
            <Text 
            fontSize={{ base: "4xl", xl: "43.6px" }} 
              fontFamily="heading" 
              color="#80BFFF"
              lineHeight="0.8"
            >
              REVIZEMC.NET
            </Text>
          </Flex>
          {/* СТРОКА 2 */}
          <Flex h={{ xl: "20px", base: "auto" }} align="center">
            <Text 
              fontSize={{ base: "12.1px", xl: "14.9px"}} 
              fontFamily="heading" 
              color="rgba(255,255,255, 0.5)"
              lineHeight="0.8"
            >
              Сайт разработан gaz1xx и overshweps
            </Text>
          </Flex>
        </Flex>

        {/* Разделитель 1 (Только мобилки) */}
        <Divider 
          display={{ base: "block", xl: "none" }}
          borderColor="#80BFFF" 
          borderBottomWidth="4px" 
          borderRadius="2px"
          opacity="1"
        />

        {/* КОЛОНКА 2: Центральный текст */}
        <Flex 
          direction="column" 
          align="center" 
          justify="space-between" 
          h="full" 
          gap={{ base: 2, xl: 0 }}
        >
          {/* СТРОКА 1 */}
          <Flex h={{ xl: "40px", base: "auto" }} align="center">
            <Text 
              fontSize={{ base: "19px", xl: "20.5px" }} 
              fontFamily="heading" 
              color="whiteAlpha.800" 
              lineHeight="1"
            >
              Неофициальный сервер.
            </Text>
          </Flex>
          {/* СТРОКА 2 */}
          <Flex h={{ xl: "20px", base: "auto" }} align="center">
            <Text 
              fontSize={{ base: "16px", xl: "17.3px" }} 
              fontFamily="heading" 
              color="whiteAlpha.800" 
              lineHeight="0.8"
            >
              Minecraft © Mojang Studios.
            </Text>
          </Flex>
        </Flex>

        {/* Разделитель 2 (Только мобилки) */}
        <Divider 
          display={{ base: "block", xl: "none" }} 
          borderColor="#80BFFF" 
          borderBottomWidth="4px" 
          borderRadius="2px" 
          opacity="1"
        />

        {/* КОЛОНКА 3: Соцсети и Админ */}
        <Flex 
          direction="column" 
          align={{ base: "center", xl: "flex-end" }} 
          justify="space-between" 
          h="full" 
          gap={{ base: 2, xl: 0 }}
        >
          {/* СТРОКА 1 */}
          <Flex h={{ xl: "40px", base: "full" }} align="center">
            <HStack spacing={4} w={{ base: "full", xl: "auto" }}>
              <Button
                as="a"
                href="https://discord.gg/SJpQDQcJvG" 
                target="_blank"
                w={{ base:"157px", xl: "190.5px" }}
                bg="transparent" color="white" h="35px" borderRadius="9px"
                border="#80BFFF solid"
                borderWidth={{ xl: "6px", base: "4px" }}
                fontFamily="heading" fontWeight="bold"
                fontSize="16px" 
                transition="all 0.2s ease-out" cursor="pointer"
                _hover={{ transform: "scale(0.96)", borderColor: "white" }}
                _active={{ transform: "scale(0.9)" }}
              >
                DISCORD
              </Button>
  
              <Button
                as="a"
                href="https://t.me/revizemc" 
                target="_blank"
                w={{ base: "157px", xl: "190.5px" }}
                bg="transparent" color="white" h="35px" borderRadius="9px"
                border="#80BFFF solid"
                borderWidth={{ xl: "6px", base: "4px" }}
                fontFamily="heading" fontWeight="bold"
                fontSize="16px"
                transition="all 0.2s ease-out" cursor="pointer"
                _hover={{ transform: "scale(0.96)", borderColor: "white" }}
                _active={{ transform: "scale(0.9)" }}
              >
                TELEGRAM
              </Button>
            </HStack>
          </Flex>

          {/* СТРОКА 2 */}
          <Flex h={{ xl: "20px", base: "auto" }} align="center">
            <HStack   
              role="group" 
              cursor="pointer" 
              transition="all 0.2s ease-in-out" 
              _hover={{ opacity: 1, transform: "scale(0.98)" }}
              _active={{ transform: "scale(0.95)" }}
              as="a" 
              href="https://t.me/overshweps"
              target="_blank"
            >
              <Box w="15px" h="15px">
                <Image
                  src={telegram}
                  alt="Логотип"
                  fit="fill"
                  draggable={false} 
                  userSelect="none"
                  opacity={0.5}
                  _groupHover={{ opacity: 1 }}
                />
              </Box>
              <Text
                fontSize={{ base: "13.5px", xl: "17.3px" }}
                fontFamily="heading" 
                color="white"
                lineHeight="0.8"
                opacity={0.5}
                _groupHover={{ opacity: 1 }}     
              >
                АДМИНИСТРАТОР: @overshweps
              </Text>
            </HStack>
          </Flex>
        </Flex>

      </SimpleGrid>
    </Flex>
  );
};