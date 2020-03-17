import React from "react";
import styled from "@emotion/styled";
import AllNotables from "./AllNotables";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation
} from "react-router-dom";

const OuterWrapper = styled.div({
  overflow: "hidden",
  height: "100vh",
  width: "100vw"
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
  display: "flex",
  flexDirection: "column",
  overflow: "hidden"
});

const TabsContainer = styled.div({
  borderBottom: "1px solid orange",
  display: "flex"
});

const Tab = styled(Link)<{ active: Boolean }>(
  {
    marginRight: "4px",
    textDecoration: "none",
    padding: "8px"
  },
  ({ active }) => ({
    backgroundColor: active ? "orange" : "#000",
    color: active ? "#000" : "orange"
  })
);

const Tabs = () => {
  const location = useLocation();

  return (
    <TabsContainer>
      <Tab to="" active={location.pathname === "/"}>
        All notables
      </Tab>
      <Tab to="/jewels" active={location.pathname === "/jewels"}>
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
            <Route path="/notable/:id">single notable</Route>
            <Route path="/jewels">sort by jewels</Route>
            <Route>
              <AllNotables />
            </Route>
          </Switch>
        </Box>
      </Container>
    </OuterWrapper>
  </Router>
);

export default App;
