import React from "react";
import DayListItem from "./DayListItem";

export default function DayList(props) {
  const days = props.days.map((e) => (
    <DayListItem
      key={e.id}
      name={e.name}
      spots={e.spots}
      selected={e.name === props.value}
      setDay={() => {
        props.onChange(e.name);
      }}
    />
  ));

  return <ul>{days}</ul>;
}
