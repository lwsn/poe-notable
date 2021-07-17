import React, { useState } from "react";
import styled from "@emotion/styled";
import jewels from "./jewels.json";
import Notables from "./notables.json";
import NotableCard, { Icon } from "./NotablesCard";
import { JewelType, NotableType } from "./types";

const Container = styled.div({
  display: "grid",
  gridGap: "8px",
});

const Name = styled.div({
  color: "#fff",
  lineHeight: "18px",
  fontSize: "14px",
  marginLeft: "8px",
});

const Size = styled.div({
  color: "#fff",
  lineHeight: "18px",
  fontSize: "14px",
  marginLeft: "auto",
});

const OuterWrapper = styled.div({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  overflow: "hidden",
  padding: "16px",
});

const NotablesContainer = styled.div({
  columns: "300px 5",
  columnGap: "8px",
  marginTop: "-8px",
});

const NotableWrapper = styled.div({
  display: "inline-block",
  width: "100%",
  breakInside: "avoid-column",
  pageBreakInside: "avoid",
  WebkitColumnBreakInside: "avoid",
  marginTop: "8px",
});

const JewelHeader = styled.button<{ expanded?: boolean }>(
  {
    position: "relative",
    border: "none",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    cursor: "pointer",
    padding: "4px",
    background: "#111",
    ":focus": { outline: "none" },
    ":after": {
      content: `""`,
      display: "block",
      marginLeft: "12px",
      marginRight: "4px",
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

const AffixHeader = styled.div({
  padding: "4px 8px",
  background: "#111",
  color: "lightblue",
  fontStyle: "italic",
  fontSize: "14px",
  display: "grid",
  gridGap: "4px",
});

const NotablesChunk = ({
  notables,
  weight,
  tag,
}: {
  notables: NotableType[];
  weight: number;
  tag: string;
}) => (
  <>
    <AffixHeader>{notables[0].type}</AffixHeader>
    <NotablesContainer>
      {notables.map(
        (notable) =>
          notable && (
            <NotableWrapper key={notable.skill}>
              <NotableCard
                weight={notable.weight?.[tag]}
                totalWeight={weight}
                notable={notable}
              />
            </NotableWrapper>
          )
      )}
    </NotablesContainer>
  </>
);

export const SingleJewel = ({
  jewel: {
    size,
    name,
    icon,
    notables = [],
    enchant,
    tag,
    prefixWeight,
    suffixWeight,
  },
}: {
  jewel: JewelType;
}) => {
  const [expanded, setExpanded] = useState(false);

  const sortedNotables = notables
    .sort((a, b) => b.weight - a.weight)
    .map(({ skill }) =>
      (Notables as NotableType[]).find((n) => n.skill === skill)
    )
    .filter((n): n is NotableType => n !== undefined);

  const prefixNotables = sortedNotables.filter(({ type }) => type === "Prefix");
  const suffixNotables = sortedNotables.filter(({ type }) => type === "Suffix");

  return (
    <>
      <JewelHeader onClick={() => setExpanded(!expanded)} expanded={expanded}>
        <Icon isSmall icon={icon} />
        <Name>{name}</Name>
        <Size>{size}</Size>
      </JewelHeader>
      {expanded && (
        <AffixHeader>
          {enchant.map((e) => (
            <span key={e}>{e}</span>
          ))}
        </AffixHeader>
      )}
      {expanded && prefixNotables.length > 0 && (
        <NotablesChunk
          weight={prefixWeight}
          tag={tag}
          notables={prefixNotables}
        />
      )}
      {expanded && suffixNotables.length > 0 && (
        <NotablesChunk
          weight={suffixWeight}
          tag={tag}
          notables={suffixNotables}
        />
      )}
    </>
  );
};

const AllJewels = () => (
  <OuterWrapper>
    <Container>
      {(jewels as JewelType[])
        .filter(({ notables }) => notables.length)
        .map((jewel) => (
          <SingleJewel key={jewel.name} jewel={jewel} />
        ))}
    </Container>
  </OuterWrapper>
);

export default AllJewels;
