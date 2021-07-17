import React from "react";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import notables from "./notables.json";
import jewels from "./jewels.json";
import { SingleJewel } from "./AllJewels";
import NotableCard from "./NotablesCard";
import { NotableType, JewelType } from "./types";

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

const OuterWrapper = styled.div({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  overflow: "hidden",
  padding: "16px",
});

const Notable = () => {
  const { id } = useParams();
  const skill = typeof id === "string" ? parseInt(id, 10) : 0;

  const notable = (notables as NotableType[]).find(
    ({ skill: nskill }) => nskill === skill
  );

  const appearsOn = (jewels as JewelType[]).filter(({ notables }) =>
    notables.some(({ skill: nskill }) => nskill === skill)
  );

  return notable ? (
    <OuterWrapper>
      <Container>
        <NotableCard key={notable.skill} notable={notable} />
        {appearsOn &&
          appearsOn.map((jewel) => (
            <SingleJewel key={jewel.name} jewel={jewel} />
          ))}
      </Container>
    </OuterWrapper>
  ) : null;
};

export default Notable;
