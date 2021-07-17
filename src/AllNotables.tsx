import React, { useState, useRef, useEffect } from "react";
import styled from "@emotion/styled";
import Notables from "./notables.json";
import NotableCard from "./NotablesCard";
import Fuse from "fuse.js";
import { useLocation, useHistory } from "react-router-dom";
import { NotableType } from "./types";

const Container = styled.div<{ single?: boolean }>({
  maxHeight: "calc(100vh - )",
  columns: "300px 5",
  columnGap: "8px",
  padding: "0 8px",
  "::-webkit-scrollbar": {
    width: "16px",
    borderRight: "8px solid #111",
  },
  "::-webkit-scrollbar-thumb": {
    borderRight: "8px solid #222",
  },
});

const Input = styled.input({
  padding: "12px 16px",
  fontSize: "16px",
  flexGrow: 1,
  border: "none",
  background: "#111",
  color: "#fff",
  ":focus": {
    outline: "none",
  },
});

const InputWrapper = styled.div({
  display: "flex",
  alignItems: "center",
  position: "sticky",
  top: "40px",
  zIndex: 9,
  borderBottom: "8px solid #222",
});

const Clear = styled.button({
  ":focus": { outline: "none" },
  cursor: "pointer",
  background: "none",
  border: "none",
  padding: "0 24px 0 27px",
  height: "100%",
  position: "absolute",
  right: 0,
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
    marginLeft: "-3px",
  },
  ":before": { transform: "rotateZ(-45deg)" },
});

const NotableWrapper = styled.div({
  display: "inline-block",
  width: "100%",
  breakInside: "avoid-column",
  pageBreakInside: "avoid",
  WebkitColumnBreakInside: "avoid",
  marginBottom: "8px",
});

const More = styled.div({
  color: "white",
  textAlign: "center",
  padding: "16px",
});

const formattedNotables = (Notables as NotableType[]).map((n) => ({ item: n }));

const maxNotables = 50;

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
      new Fuse(Notables as NotableType[], {
        threshold: 0.15,
        distance: 1000,
        includeScore: true,
        keys: [
          {
            name: "stats",
            weight: 0.5,
          },
          {
            name: "name",
            weight: 0.5,
          },
        ],
      })
    );

    const result = term ? fuse.search(term) : formattedNotables;

    const rest = result.length - maxNotables;

    return (
      <>
        <Container single={result.length === 1}>
          {result.slice(0, maxNotables).map(({ item: notable }) => (
            <NotableWrapper key={notable.skill}>
              <NotableCard notable={notable} />
            </NotableWrapper>
          ))}
        </Container>
        {rest > 0 && <More>{rest} notables hidden, refine your search</More>}
      </>
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
    <>
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
    </>
  );
};

export default AllNotables;
