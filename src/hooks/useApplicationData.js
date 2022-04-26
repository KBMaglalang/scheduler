import { useState, useEffect } from "react";
import axios from "axios";
import { getAppointmentsForDay } from "helpers/selectors";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => setState({ ...state, day });

  function updateAppointments(id, interview) {
    console.log("state", state);

    const appointment = {
      ...state.appointments[id],
      interview: interview ? { ...interview } : null,
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    // get the days index that I am working with
    const indexToUpdateSlots = state.days.findIndex(
      (e) => e.name === state.day
    );

    // calculate the number of spots available in the appointments with the latest information
    const spotsRemaining = getAppointmentsForDay(
      { appointments, days: state.days },
      state.day
    ).filter((e) => e.interview === null).length;

    // update the number of spots left
    const newDay = {
      ...state.days[indexToUpdateSlots],
      spots: spotsRemaining,
    };
    const days = [...state.days];
    days[indexToUpdateSlots] = newDay;

    setState({ ...state, appointments, days });
  }

  function bookInterview(id, interview) {
    return axios.put(`/api/appointments/${id}`, { interview }).then(() => {
      updateAppointments(id, interview);
    });
  }

  function cancelInterview(id) {
    return axios
      .delete(`/api/appointments/${id}`, { interview: null })
      .then(() => {
        updateAppointments(id, null);
      });
  }

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);

  return { state, setDay, bookInterview, cancelInterview };
}
