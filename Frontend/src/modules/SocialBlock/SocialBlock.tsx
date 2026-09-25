import { Button, HStack, Image, Text, VStack } from "@chakra-ui/react";

import socialLogo from "./images/social.png";

const MAIN_COLOR = "#FFFF80";
const BUTTON_TEXT_COLOR = "#592828";
const BORDER_RADIUS = "15px";
const BORDER_WIDTH = { base: "4px", xl: "6px" };

const SOCIAL_LINKS = [
  {
    label: "TELEGRAM-КАНАЛ",
    href: "https://t.me/revizemc",
  },
  {
    label: "TELEGRAM-ЧАТ",
    href: "https://t.me/revizechat",
  },
  {
    label: "DISCORD-СЕРВЕР",
    href: "https://discord.gg/SJpQDQcJvG",
  },
];

const buttonStyles = {
  w: "full",
  flexShrink: 0,
  h: "50px",
  borderRadius: BORDER_RADIUS,
  bg: MAIN_COLOR,
  color: BUTTON_TEXT_COLOR,
  fontFamily: "heading",
  fontSize: { base: "13px", xl: "20px" },
  transition: "transform 0.3s ease-out",
  _hover: {
    transform: "scale(0.96)",
  },
  _active: {
    transform: "scale(0.9)",
  },
};

export const SocialBlock = () => {
  const openLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <VStack
      align="stretch"
      w="full"
      maxW={{ base: "370px", xl: "635px" }}
      mt={{ base: "15px", xl: "30px" }}
      p={4}
      gap={4}
      border="solid"
      borderColor={MAIN_COLOR}
      borderWidth={BORDER_WIDTH}
      borderRadius="25px"
      bgGradient="linear(to-t, transparent, rgba(255, 255, 128, 0.15))"
    >
      <HStack spacing={3}>
        <Image
          src={socialLogo}
          alt="Социальные сети"
          boxSize={{ base: "27px", xl: "36px" }}
          draggable={false}
          userSelect="none"
        />

        <Text
          color={MAIN_COLOR}
          fontFamily="heading"
          fontSize={{ base: "xl", xl: "3xl" }}
        >
          СОЦИАЛЬНЫЕ СЕТИ
        </Text>
      </HStack>

      <Text
        color="white"
        fontFamily="heading"
        fontSize={{ base: "13px", xl: "20px" }}
        lineHeight="1.2"
      >
        СЛЕДИТЕ ЗА ОБНОВЛЕНИЯМИ ПРОЕКТА,
        <br />
        ПОЛУЧАЙТЕ ПОДАРКИ В РОЗЫГРЫШАХ
        <br />И ОБЩАЙТЕСЬ СО ВСЕМИ ИГРОКАМИ
      </Text>

      <VStack w="full" spacing={4}>
        <HStack
          w="full"
          spacing={4}
          flexDirection={{ base: "column", xl: "row" }}
        >
          {SOCIAL_LINKS.slice(0, 2).map(({ label, href }) => (
            <Button
              key={label}
              {...buttonStyles}
              flex={{ base: "none", xl: 1 }}
              onClick={() => openLink(href)}
            >
              {label}
            </Button>
          ))}
        </HStack>

        <Button
          {...buttonStyles}
          onClick={() => openLink(SOCIAL_LINKS[2].href)}
        >
          {SOCIAL_LINKS[2].label}
        </Button>
      </VStack>
    </VStack>
  );
};
