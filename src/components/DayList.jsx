import React from "react";
import DayListItem from "./DayListItem";

export default function DayList(props) {
  return (
    <ul>
      {props.days.map((e) => (
        <DayListItem
          key={e.id}
          name={e.name}
          spots={e.spots}
          selected={e.name === props.day}
          setDay={props.setDay}
        />
      ))}
    </ul>
  );
}
