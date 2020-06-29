import React from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

interface Notable {
  name: string;
  skill: number;
  stats: string[];
  reminderText?: string[];
  icon: string;
  isKeystone?: boolean;
  isNotable?: boolean;
  flavourText?: string[];
  type: string;
  weight: { [key: string]: number | undefined };
}

const Wrapper = styled(Link)({
  display: "flex",
  padding: "8px",
  backgroundColor: "#111",
  border: "1px solid #222",
  textDecoration: "none",
  transition: "background-color 0.3s",
  ":hover": {
    backgroundColor: "#1A1A1A"
  }
});

const TextContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  color: "white",
  marginLeft: "8px"
});

const Title = styled.h3({
  fontSize: "16px",
  margin: 0,
  marginBottom: "8px"
});

const Description = styled.p({
  fontSize: "12px",
  lineHeight: "16px",
  margin: "0 0 4px"
});

const MetaInfo = styled(Description)({
  color: "#666",
  fontStyle: "italic",
  marginTop: "auto"
});

const Icon = styled.div<{ isKeystone?: boolean; icon: string }>(
  {
    backgroundSize: "cover",
    flexShrink: 0,
    flexGrow: 0,
    position: "relative",
    backgroundColor: "#222",
    ":after": {
      display: "block",
      content: `""`,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      border: "1px solid rgba(255, 255, 255, 0.7)",
      mixBlendMode: "overlay"
    }
  },
  ({ icon }) => ({
    backgroundImage: `url(${process.env.PUBLIC_URL}${icon})`
  }),
  ({ isKeystone }) => ({
    width: isKeystone ? "64px" : "48px",
    height: isKeystone ? "64px" : "48px"
  })
);

const NotableCard = ({
  notable: { name, stats, icon, isKeystone, skill, type },
  weight
}: {
  notable: Notable;
  weight?: number;
}) => (
  <Wrapper to={`/notable/${skill}`}>
    <Icon icon={icon} isKeystone={isKeystone} />
    <TextContainer>
      <Title>{name}</Title>
      {stats.map((text, key) => (
        <Description key={key}>{text}</Description>
      ))}
      {weight && (
        <MetaInfo>
          {type === "suffix" ? "Suffix" : "Prefix"}, weight: {weight}
        </MetaInfo>
      )}
      {probability && <Probability>{probability}</Probability>}
    </TextContainer>
  </Wrapper>
);

export default NotableCard;
