import React from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { NotableType } from "./types";

const Wrapper = styled(Link)({
  display: "grid",
  padding: "8px",
  gridGap: "8px",
  gridTemplateAreas: "",
  backgroundColor: "#111",
  textDecoration: "none",
  transition: "background-color 0.3s",
  ":hover": {
    backgroundColor: "#1A1A1A",
  },
  gridTemplateColumns: "min-content 1fr",
  gridTemplateRows: "min-content 1fr",
  alignItems: "end",
  borderRadius: "2px",
});

const TextContainer = styled.div({
  alignSelf: "start",
  display: "grid",
  gridGap: "4px",
  color: "white",
  gridColumn: "2/-1",
  gridRow: "1/-1",
});

const Title = styled.h3({
  fontSize: "16px",
  lineHeight: "12px",
  margin: "0 0 4px",
});

const Description = styled.p({
  fontSize: "12px",
  lineHeight: "16px",
  margin: 0,
});

const Spacer = styled.div({ flexGrow: 1 });

const MetaInfo = styled(Description)({
  color: "#666",
  fontStyle: "italic",
});

const IconImg = styled.img<{
  isSmall?: boolean;
  isKeystone?: boolean;
}>(
  {
    display: "block",
  },
  ({ isKeystone, isSmall }) => ({
    width: (isKeystone && "53px") || (isSmall && "27px") || "38px",
    height: (isKeystone && "54px") || (isSmall && "27px") || "38px",
  })
);

const IconBorder = styled.div({
  position: "relative",
  backgroundColor: "#222",
  ":after": {
    display: "block",
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    border: "1px solid rgba(255, 255, 255, 0.5)",
    mixBlendMode: "overlay",
    zIndex: 2,
  },
});

export const Icon = ({
  isSmall,
  isKeystone,
  icon,
}: {
  isSmall?: boolean;
  isKeystone?: boolean;
  icon: string;
}) => (
  <IconBorder>
    <IconImg
      isSmall={isSmall}
      isKeystone={isKeystone}
      src={`${process.env.PUBLIC_URL}${icon}`}
    />
  </IconBorder>
);

const NotableCard = ({
  notable: {
    name,
    stats,
    icon,
    isKeystone,
    skill,
    reminderText = [],
    flavourText = [],
  },
  weight,
  totalWeight = 1,
  showReminder,
}: {
  notable: NotableType;
  weight?: number;
  totalWeight?: number;
  showReminder?: boolean;
}) => (
  <Wrapper to={`/notable/${skill}`}>
    <Icon icon={icon} isKeystone={isKeystone} />
    <TextContainer>
      <Title>{name}</Title>
      {stats.map((text) => (
        <Description key={text}>{text}</Description>
      ))}
      {showReminder && <Spacer />}
      {showReminder &&
        [...reminderText, ...flavourText].map((t) => (
          <MetaInfo key={t}>{t}</MetaInfo>
        ))}
    </TextContainer>
    {weight && (
      <MetaInfo>{((weight / totalWeight) * 100).toFixed(2)}%</MetaInfo>
    )}
  </Wrapper>
);

export default NotableCard;
