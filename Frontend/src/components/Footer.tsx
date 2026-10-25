import { Box, Flex, Grid, Link, Text } from "@chakra-ui/react";

const FOOTER_LINKS = [
  {
    label: "ПОЛЬЗОВАТЕЛЬСКОЕ СОГЛАШЕНИЕ",
    href: "https://www.revizemc.net/terms-of-service.pdf",
  },
  {
    label: "ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ",
    href: "https://www.revizemc.net/privacy-policy.pdf",
  },
];

const baseTextStyles = {
  fontFamily: "heading",
  fontSize: { base: "12px", xl: "12.75px" },
  lineHeight: "1.5",
  letterSpacing: "wide",
};

const mutedTextStyles = {
  ...baseTextStyles,
  fontSize: { base: "9px", xl: "12.1px" },
  color: "rgba(255, 255, 255, 0.5)",
};

const linkStyles = {
  ...baseTextStyles,
  color: "#80BFFF",
  transition: "color 0.3s ease-in-out",
  _hover: {
    color: "white",
    textDecoration: "none",
  },
};

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Flex
      as="footer"
      w="full"
      maxW={{ base: "370px", xl: "1300px" }}
      minH={{ base: "120px", xl: "100px" }}
      bgGradient="linear(to-t, transparent, rgba(153, 217, 255, 0.15))"
      border="solid #80BFFF"
      borderWidth={{ base: "4px", xl: "6px" }}
      borderRadius="25px"
      px={{ base: 3, xl: 5 }}
      py={{ base: 3, xl: 4 }}
      mt={{ base: "15px", xl: "30px" }}
      direction="column"
      justifyContent="space-between"
      gap={3}
    >
      <Grid
        w="full"
        templateColumns={{ base: "1fr", xl: "1fr 1fr" }}
        alignItems="start"
        columnGap={6}
        rowGap={2}
      >
        <Box textAlign={{ base: "center", xl: "left" }}>
          <Text
            fontSize={{ base: "12px", xl: "16px" }}
            color={ "white" }
          >
            REVIZEMC НЕ СВЯЗАН С MOJANG STUDIOS
          </Text>

          <Text {...mutedTextStyles}>
            САМОЗАНЯТЫЙ ЛЯПУНОВ Алексей Александрович
          </Text>

          <Text {...mutedTextStyles}>
            ИНН: 272200094602 •{" "}
            <Link
              href="mailto:admin@revizemc.net"
              color="inherit"
              transition="color 0.3s ease-in-out"
              _hover={{
                color: "white",
                textDecoration: "none",
              }}
            >
              admin@revizemc.net
            </Link>
          </Text>
        </Box>

        <Box textAlign={{ base: "center", xl: "right" }}>
          <Text
            {...baseTextStyles}
            color="white"
            fontSize={{ base: "12px", xl: "16px" }}
          >
            ПРАВОВАЯ ИНФОРМАЦИЯ
          </Text>

          <Flex
            direction="column"
            alignItems={{ base: "center", xl: "flex-end" }}
          >
            {FOOTER_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                {...linkStyles}
              >
                {label}
              </Link>
            ))}
          </Flex>
        </Box>
      </Grid>
    </Flex>
  );
};
