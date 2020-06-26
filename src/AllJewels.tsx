import React, { useState } from "react";
import styled from "@emotion/styled";
import Jewels from "./Jewels";
import Notables from "./Notables";
import NotableCard from "./NotablesCard";

const Container = styled.div({
  display: "grid",
  gridTemplateColumns: "1fr",
  gridGap: "16px",
  overflowY: "auto",
  overflowX: "hidden",
  "::-webkit-scrollbar": {
    width: "16px",
    borderRight: "8px solid #111"
  },
  "::-webkit-scrollbar-thumb": {
    borderRight: "8px solid #222"
  }
});

const JewelSectionHeader = styled.h3({
  "&:first-of-type": { marginTop: 0 },
  margin: "8px 0 0"
});

const Jewel = styled.div({
  backgroundColor: "#111",
  padding: "8px",
  display: "flex",
  flexDirection: "column",
  position: "relative"
});

const Enchantment = styled.div({
  color: "lightblue",
  lineHeight: "18px",
  fontSize: "14px",
  marginRight: "32px"
});

const OuterWrapper = styled.div({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  overflow: "hidden",
  padding: "16px"
});

const NotablesContainer = styled.div({
  marginTop: "8px",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gridGap: "8px"
});

const JewelHeader = styled.button<{ expanded?: boolean }>(
  {
    position: "relative",
    border: "none",
    display: "flex",
    flexDirection: "column",
    background: "none",
    cursor: "pointer",
    ":focus": { outline: "none" },
    ":after": {
      content: `""`,
      position: "absolute",
      display: "block",
      right: "4px",
      width: 0,
      height: 0,
      border: "4px solid transparent",
      borderRight: "4px solid #555",
      borderBottom: "4px solid #555"
    }
  },
  ({ expanded }) => ({
    ":after": {
      transform: `rotateZ(${expanded ? "225" : "45"}deg)`,
      top: expanded ? "5px" : 0
    }
  })
);

const SingleJewel = ({
  jewel: { enchantment, notables }
}: {
  jewel: typeof Jewels[0];
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Jewel>
      <JewelHeader onClick={() => setExpanded(!expanded)} expanded={expanded}>
        {typeof enchantment === "string" ? (
          <Enchantment>{enchantment}</Enchantment>
        ) : (
          Array.isArray(enchantment) &&
          enchantment.map(e => <Enchantment>{e}</Enchantment>)
        )}
      </JewelHeader>
      {expanded && (
        <NotablesContainer>
          {Notables.filter(({ skill }) =>
            notables.some(({ skill: nskill }) => skill === nskill)
          ).map(notable => (
            <NotableCard key={notable.skill} notable={notable} />
          ))}
        </NotablesContainer>
      )}
    </Jewel>
  );
};

const JewelSection = ({ jewels }: { jewels: typeof Jewels }) => (
  <>
    {jewels.map(jewel => (
      <SingleJewel key={jewel.id} jewel={jewel} />
    ))}
  </>
);

const AllJewels = () => {
  return (
    <OuterWrapper>
      <Container>
        <JewelSectionHeader>Large</JewelSectionHeader>
        <JewelSection jewels={Jewels.filter(({ size }) => size === "large")} />
        <JewelSectionHeader>Medium</JewelSectionHeader>
        <JewelSection jewels={Jewels.filter(({ size }) => size === "medium")} />
        <JewelSectionHeader>Small</JewelSectionHeader>
        <JewelSection jewels={Jewels.filter(({ size }) => size === "small")} />
      </Container>
    </OuterWrapper>
  );
};

export default AllJewels;
