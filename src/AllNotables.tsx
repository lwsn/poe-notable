import React, { useState, useRef, useEffect } from "react";
import styled from "@emotion/styled";
import Notables from "./Notables";
import NotableCard from "./NotablesCard";
import Fuse from "fuse.js";
import { useLocation, useHistory } from "react-router-dom";

const Container = styled.div<{ single?: boolean }>({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  overflowY: "auto",
  overflowX: "hidden",
  gridGap: "16px",
  "::-webkit-scrollbar": {
    width: "16px",
    borderRight: "8px solid #111"
  },
  "::-webkit-scrollbar-thumb": {
    borderRight: "8px solid #222"
  }
});

const OuterWrapper = styled.div({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  overflow: "hidden",
  padding: "16px"
});

const Input = styled.input({
  padding: "12px 16px",
  fontSize: "16px",
  flexGrow: 1,
  border: "none"
});

const InputWrapper = styled.div({
  display: "flex",
  background: "#FFF",
  margin: "0 0 16px",
  alignItems: "center"
});

const Clear = styled.button({
  ":focus": { outline: "none" },
  cursor: "pointer",
  background: "none",
  border: "none",
  padding: "0 24px 0 27px",
  height: "100%",
  position: "relative",
  display: "flex",
  flexDirection: "row-reverse",
  alignItems: "center",
  ":after, :before": {
    content: `""`,
    display: "block",
    width: "3px",
    height: "24px",
    background: "#777",
    transform: "rotateZ(45deg)",
    borderRadius: "2px",
    marginLeft: "-3px"
  },
  ":before": { transform: "rotateZ(-45deg)" }
});

const More = styled.div({
  color: "white"
});

const formattedNotables = Notables.map(n => ({ item: n }));

const maxNotables = 30;

const getParams = (search: string) =>
  search
    .slice(1)
    .split("&")
    .reduce<{ [x: string]: boolean | string }>(
      (acc, s) => ({ ...acc, [s.split("=")[0]]: s.split("=")[1] || true }),
      {}
    );

const List = React.memo(
  ({ term }: { term: string }) => {
    const { current: fuse } = useRef(
      new Fuse(Notables, {
        threshold: 0.15,
        distance: 1000,
        includeScore: true,
        keys: [
          {
            name: "description",
            weight: 0.5
          },
          {
            name: "name",
            weight: 0.5
          }
        ]
      })
    );

    const result = term ? fuse.search(term) : formattedNotables;

    const rest = result.length - maxNotables;

    return (
      <Container single={result.length === 1}>
        {result.slice(0, maxNotables).map(({ item: notable }) => (
          <NotableCard key={notable.name} notable={notable} />
        ))}
        {rest > 0 && <More>... And {rest} more</More>}
      </Container>
    );
  },
  ({ term: prevTerm }, { term }) => prevTerm === term
);

const AllNotables = () => {
  const { search } = useLocation();
  let initialValue = getParams(search).s;
  initialValue = typeof initialValue === "string" ? initialValue : "";
  const [term, setTerm] = useState(initialValue);
  const [debouncedTerm, setDebouncedTerm] = useState(initialValue);
  const hist = useHistory();

  const bounce = useRef<number>();

  useEffect(() => {
    if (term !== debouncedTerm) {
      window.clearTimeout(bounce.current);
      bounce.current = window.setTimeout(() => {
        hist.replace(term ? `?s=${term}` : "");
        setDebouncedTerm(term);
      }, 250);
    }
    return () => window.clearTimeout(bounce.current);
  }, [term, hist, debouncedTerm]);

  return (
    <OuterWrapper>
      <InputWrapper>
        <Input
          onChange={({ target: { value } }) => setTerm(value)}
          value={term}
          type="text"
          placeholder="Search notable name or description..."
        />
        {term && <Clear onClick={() => setTerm("")} />}
      </InputWrapper>
      <List term={debouncedTerm} />
    </OuterWrapper>
  );
};

export default AllNotables;
