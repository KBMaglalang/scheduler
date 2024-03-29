import React from "react";
import InterviewerListItem from "./InterviewerListItem";
import "components/InterviewerList.scss";

export default function InterviewerList(props) {
  const interviewerList = props.interviewers.map((e) => (
    <InterviewerListItem
      key={e.id}
      name={e.name}
      avatar={e.avatar}
      selected={e.id === props.value}
      setInterviewer={() => {
        props.onChange(e.id);
      }}
    />
  ));

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{interviewerList}</ul>
    </section>
  );
}
