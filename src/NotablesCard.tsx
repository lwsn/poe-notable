import React from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

interface Notable {
  name: string;
  description: string | string[];
  id: string;
  icon: string;
  keystone?: boolean;
}

const Wrapper = styled(Link)<{ keystone?: boolean }>({
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

const Probability = styled.p({
  fontSize: "11px",
  lineHeight: "14px",
  fontStyle: "italic",
  textAlign: "right",
  width: "100%",
  marginTop: "auto",
  marginBottom: 0
});

const Icon = styled.div<{ keystone?: boolean; icon: string }>(
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
  ({ keystone }) => ({
    width: keystone ? "64px" : "48px",
    height: keystone ? "64px" : "48px"
  })
);

const NotableCard = ({
  notable: { name, description, icon, keystone, id },
  probability
}: {
  notable: Notable;
  probability?: string;
}) => (
  <Wrapper to={`/notable/${id}`}>
    <Icon icon={icon} keystone={keystone} />
    <TextContainer>
      <Title>{name}</Title>
      {typeof description === "string" ? (
        <Description>{description}</Description>
      ) : (
        description.map((text, key) => (
          <Description key={key}>{text}</Description>
        ))
      )}
      {probability && <Probability>{probability}</Probability>}
    </TextContainer>
  </Wrapper>
);

export default NotableCard;
