import React from "react";
import { useParams } from "react-router-dom";
import notables from "./Notables";
import jewels from "./Jewels";

const Notable = () => {
  console.log(useParams());
  const { id } = useParams();
  const skill = typeof id === "string" ? parseInt(id, 10) : 0;

  const notable = notables.find(({ skill: nskill }) => nskill === skill);

  const appearsOn = jewels.filter(({ notables }) =>
    notables.some(({ skill: nskill }) => nskill === skill)
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
