import React from "react";
import styled from "@emotion/styled";

const Container = styled.div({
  display: "flex",
  padding: "16px",
  flexDirection: "column",
  alignItems: "center"
});

const Box = styled.div({
  minWidth: "980px",
  backgroundColor: "black",
  padding: "16px"
});

const App = () => (
  <Container>
    <Box />
  </Container>
);

export default App;
