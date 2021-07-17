import React from "react";
import styled from "@emotion/styled";
import AllNotables from "./AllNotables";
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useLocation,
  useRouteMatch,
} from "react-router-dom";
import AllJewels from "./AllJewels";
import SingleNotable from "./SingleNotable";

const TabsContainer = styled.div({
  display: "flex",
  position: "sticky",
  top: 0,
  zIndex: 9,
  backgroundColor: "#000",
  height: "40px",
});

const Tab = styled(Link, { shouldForwardProp: (prop) => prop !== "isActive" })<{
  isActive: Boolean;
}>(
  {
    marginRight: "4px",
    textDecoration: "none",
    padding: "8px",
    zIndex: 1,
  },
  ({ isActive }) => ({
    backgroundColor: isActive ? "orange" : "#000",
    color: isActive ? "#000" : "orange",
  })
);

const Tabs = () => {
  const location = useLocation();
  const id = useRouteMatch<{ id: string }>("/notable/:id")?.params.id;
  console.log(id);

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
    <Tabs />
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
  </Router>
);

export default App;
