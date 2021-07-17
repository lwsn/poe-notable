import React, { useState } from "react";
import styled from "@emotion/styled";
import Jewels from "./jewels.json";
import Notables from "./notables.json";
import NotableCard, { Icon } from "./NotablesCard";
import { JewelType, NotableType } from "./types";

const Container = styled.div({
  display: "grid",
  gridTemplateColumns: "1fr",
  gridGap: "16px",
  overflowY: "auto",
  overflowX: "hidden",
  "::-webkit-scrollbar": {
    width: "16px",
    borderRight: "8px solid #111",
  },
  "::-webkit-scrollbar-thumb": {
    borderRight: "8px solid #222",
  },
});

const JewelSectionHeader = styled.h3({
  "&:first-of-type": { marginTop: 0 },
  margin: "8px 0 0",
});

const Jewel = styled.div({
  backgroundColor: "#111",
  padding: "8px",
  display: "flex",
  flexDirection: "column",
  position: "relative",
});

const Enchantment = styled.div({
  color: "lightblue",
  lineHeight: "18px",
  fontSize: "14px",
  marginLeft: "8px",
});

const OuterWrapper = styled.div({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  overflow: "hidden",
  padding: "16px",
});

const NotablesContainer = styled.div({
  marginTop: "8px",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gridGap: "8px",
});

const JewelHeader = styled.button<{ expanded?: boolean }>(
  {
    position: "relative",
    border: "none",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    background: "none",
    cursor: "pointer",
    ":focus": { outline: "none" },
    ":after": {
      content: `""`,
      display: "block",
      marginLeft: "auto",
      border: "4px solid transparent",
      borderRight: "4px solid #555",
      borderBottom: "4px solid #555",
    },
  },
  ({ expanded }) => ({
    ":after": {
      transform: `rotateZ(${expanded ? "225" : "45"}deg)`,
      marginTop: expanded ? "3px" : "-5px",
    },
  })
);

export const SingleJewel = ({
  jewel: { name, icon, enchant, notables, tag, prefixWeight, suffixWeight },
}: {
  jewel: JewelType;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Jewel>
      <JewelHeader onClick={() => setExpanded(!expanded)} expanded={expanded}>
        <Icon isSmall icon={icon} />
        <Enchantment>{name}</Enchantment>
      </JewelHeader>
      {expanded && (
        <NotablesContainer>
          {notables
            .sort((a, b) =>
              a.type !== b.type
                ? a.type === "Suffix"
                  ? 1
                  : -1
                : b.weight - a.weight
            )
            .map(({ skill }) =>
              (Notables as NotableType[]).find((n) => n.skill === skill)
            )
            .map(
              (notable) =>
                notable && (
                  <NotableCard
                    key={notable.skill}
                    weight={notable.weight?.[tag]}
                    totalWeight={
                      notable.type === "Suffix" ? suffixWeight : prefixWeight
                    }
                    notable={notable}
                  />
                )
            )}
        </NotablesContainer>
      )}
    </Jewel>
  );
};

const JewelSection = ({ jewels }: { jewels: JewelType[] }) => (
  <>
    {jewels
      .filter(({ notables }) => notables.length)
      .map((jewel) => (
        <SingleJewel key={jewel.name} jewel={jewel} />
      ))}
  </>
);

const AllJewels = () => (
  <OuterWrapper>
    <Container>
      <JewelSectionHeader>Large</JewelSectionHeader>
      <JewelSection
        jewels={(Jewels as JewelType[]).filter(({ size }) => size === "Large")}
      />
      <JewelSectionHeader>Medium</JewelSectionHeader>
      <JewelSection
        jewels={(Jewels as JewelType[]).filter(({ size }) => size === "Medium")}
      />
      <JewelSectionHeader>Small</JewelSectionHeader>
      <JewelSection
        jewels={(Jewels as JewelType[]).filter(({ size }) => size === "Small")}
      />
    </Container>
  </OuterWrapper>
);

export default AllJewels;
