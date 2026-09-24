import { Text } from "@chakra-ui/react";

export const CreatorCredits = () => {
  return (
    <>
      <Text
        fontSize="10px"
        fontFamily="heading"
        color="rgba(255,255,255, 0.3)"
        textAlign="center"
        mt={"10px"}
        mb={"5px"}
        transition="all 0.45s ease-out"
      >
        Сайт разработан{" "}
        <Text
          display="inline-block"
          as="span"
          color="rgba(255,255,255, 0.45)"
          cursor="pointer"
          transition="all 0.2s ease-out"
          onClick={(e) => {
            e.stopPropagation();
            window.open("https://github.com/Gaz1x", "_blank");
          }}
          sx={{
            "&:hover": {
              color: "rgba(255,255,255,0.55)",
            },
            "&:active": {
              transform: "scale(0.95)",
            },
          }}
        >
          gaz1xx
        </Text>{" "}
        и{" "}
        <Text
          display="inline-block"
          as="span"
          color="rgba(255,255,255, 0.45)"
          cursor="pointer"
          transition="all 0.2s ease-out"
          onClick={(e) => {
            e.stopPropagation();
            window.open("https://t.me/overshweps", "_blank");
          }}
          sx={{
            "&:hover": {
              color: "rgba(255,255,255,0.55)",
            },
            "&:active": {
              transform: "scale(0.95)",
            },
          }}
        >
          overshweps
        </Text>
      </Text>
    </>
  );
};
