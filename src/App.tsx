import React from "react";
import styled from "@emotion/styled";
import Notables from "./Notables.json";
import NotableCard from "./NotablesCard";

const Container = styled.div({
  display: "flex",
  padding: "16px",
  flexDirection: "column",
  alignItems: "center"
});

const Box = styled.div({
  minWidth: "980px",
  backgroundColor: "black",
  padding: "8px",
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  div: {
    margin: "8px"
  }
});

const App = () => (
  <Container>
    <Box>
      {Notables.map((notable, i) => (
        <NotableCard key={i} notable={notable} />
      ))}
    </Box>
  </Container>
);

export default App;
