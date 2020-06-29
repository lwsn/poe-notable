import React from "react";
import styled from "@emotion/styled";
import AllNotables from "./AllNotables";
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useLocation
} from "react-router-dom";
import AllJewels from "./AllJewels";
import SingleNotable from "./SingleNotable";

const OuterWrapper = styled.div({
  overflow: "hidden",
  height: "100vh",
  width: "100vw",
  backgroundColor: "#555"
});

const Container = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  margin: "0 auto",
  maxWidth: "980px",
  "@media only screen and (min-width: 768px)": {
    padding: "16px"
  },
  height: "100%"
});

const Box = styled.div({
  backgroundColor: "black",
  color: "white",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden"
});

const TabsContainer = styled.div({
  borderBottom: "1px solid orange",
  display: "flex",
  position: "relative",
  ":before": {
    content: `""`,
    bottom: "0",
    width: "100%",
    display: "block",
    height: "1px",
    position: "absolute",
    backgroundColor: "#000"
  }
});

const Tab = styled(Link, { shouldForwardProp: prop => prop !== "isActive" })<{
  isActive: Boolean;
}>(
  {
    marginRight: "4px",
    textDecoration: "none",
    padding: "8px",
    zIndex: 1
  },
  ({ isActive }) => ({
    backgroundColor: isActive ? "orange" : "#000",
    color: isActive ? "#000" : "orange"
  })
);

const Tabs = () => {
  const location = useLocation();

  return (
    <TabsContainer>
      <Tab to="/" isActive={location.pathname === "/"}>
        All notables
      </Tab>
      <Tab to="/jewels" isActive={location.pathname === "/jewels"}>
        Cluster jewels
      </Tab>
    </TabsContainer>
  );
};

const App = () => (
  <Router>
    <OuterWrapper>
      <Container>
        <Tabs />
        <Box>
          <Switch>
            <Route path="/notable/:id">
              <SingleNotable />
            </Route>
            <Route path="/jewels">
              <AllJewels />
            </Route>
            <Route exact path="/">
              <AllNotables />
            </Route>
            <Redirect to="/" />
          </Switch>
        </Box>
      </Container>
    </OuterWrapper>
  </Router>
);

export default App;
