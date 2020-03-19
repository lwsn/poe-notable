import React from "react";
import styled from "@emotion/styled";
import AllNotables from "./AllNotables";
import { Link, useParams } from "react-router-dom";
import notables from "./Notables";
import jewels from "./Jewels";

const Notable = () => {
  const { id } = useParams();

  const notable = notables.find(({ id: nid }) => nid === id);

  const appearsOn = jewels.filter(({ notables }) =>
    notables.some(({ id: nid }) => nid === id)
  );

  console.log(appearsOn);

  return (
    <div>
      {notable && notable.name}
      {appearsOn &&
        appearsOn.map(({ enchantment }) => <div>{enchantment}</div>)}
    </div>
  );
};

export default Notable;
