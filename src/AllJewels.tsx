import React, { useState } from "react";
import styled from "@emotion/styled";
import Jewels from "./Jewels";
import Notables from "./Notables";

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

const JewelHeader = styled.h3({
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
  fontSize: "14px"
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
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gridGap: "8px"
});

const NotableCard = styled.div({
  display: "flex",
  backgroundColor: "rgba(0,0,0,0.4)",
  padding: "4px",
  alignItems: "center"
});

const ToggleExpand = styled.button<{ expanded?: boolean }>(
  {
    position: "absolute",
    top: 0,
    right: 0,
    height: "34px",
    width: "34px",
    border: "none",
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "none",
    cursor: "pointer",
    ":focus": { outline: "none" },
    ":after": {
      content: `""`,
      display: "block",
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
      marginTop: expanded ? "5px" : "-5px"
    }
  })
);

const NotableHeader = styled.h4({
  margin: "0 0 0 8px ",
  fontSize: "14px"
});

const NotableIcon = styled.div<{ keystone?: boolean; icon: string }>(
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
    },
    width: "32px",
    height: "32px"
  },
  ({ icon }) => ({
    backgroundImage: `url(${process.env.PUBLIC_URL}${icon})`
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
      <ToggleExpand
        onClick={() => setExpanded(!expanded)}
        expanded={expanded}
      />
      {typeof enchantment === "string" ? (
        <Enchantment>{enchantment}</Enchantment>
      ) : (
        Array.isArray(enchantment) &&
        enchantment.map(e => <Enchantment>{e}</Enchantment>)
      )}
      {expanded && (
        <NotablesContainer>
          {Notables.filter(({ id }) =>
            notables.some(({ id: nid }) => id === nid)
          ).map(({ icon, id, name }) => (
            <NotableCard key={id}>
              <NotableIcon icon={icon} />
              <NotableHeader>{name}</NotableHeader>
            </NotableCard>
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
        <JewelHeader>Large</JewelHeader>
        <JewelSection jewels={Jewels.filter(({ size }) => size === "large")} />
        <JewelHeader>Medium</JewelHeader>
        <JewelSection jewels={Jewels.filter(({ size }) => size === "medium")} />
        <JewelHeader>Small</JewelHeader>
        <JewelSection jewels={Jewels.filter(({ size }) => size === "small")} />
      </Container>
    </OuterWrapper>
  );
};

export default AllJewels;
