import React from "react";
// import classNames from "classnames";
import "components/Appointment/styles.scss";

export default function Appointment(props) {
  const formatAppointment = () => {
    if (!props.time) {
      return "No Appointments";
    }

    return `Appointment at ${props.time}`;
  };

  return <article className="appointment">{formatAppointment()}</article>;
}
