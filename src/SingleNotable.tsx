import React from "react";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import notables from "./Notables";
import jewels from "./Jewels";
import { SingleJewel } from "./AllJewels";
import NotableCard from "./NotablesCard";

const Container = styled.div({
  display: "flex",
  flexDirection: "column",
  padding: "8px",
  overflowY: "hidden"
});

const JewelContainer = styled.div({
  display: "grid",
  gridTemplateRows: "auto",
  gridGap: "8px",
  overflowY: "auto",
  "::-webkit-scrollbar": {
    width: "16px",
    borderRight: "8px solid #111"
  },
  "::-webkit-scrollbar-thumb": {
    borderRight: "8px solid #222"
  },
  marginTop: "8px"
});

const Notable = () => {
  const { id } = useParams();

  const notable = notables.find(({ id: nid }) => nid === id);

  const appearsOn = jewels.filter(({ notables }) =>
    notables.some(({ id: nid }) => nid === id)
  );

  return notable ? (
    <Container>
      <NotableCard notable={notable} />
      {appearsOn && (
        <JewelContainer>
          {appearsOn.map(jewel => (
            <SingleJewel key={jewel.id} jewel={jewel} />
          ))}
        </JewelContainer>
      )}
    </Container>
  ) : null;
};

export default Notable;
