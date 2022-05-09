import { useEffect, useReducer, useRef } from "react";
import axios from "axios";
import { getAppointmentsForDay } from "helpers/selectors";
import reducer, {SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW } from "../reducers/application"

export default function useApplicationData() {
  

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });
  const webSocket = useRef(null);

  const setDay = (day) => dispatch({ type: SET_DAY, value: day });

  const updatedDaysSpot = (appointments) => {
    // calculate the number of spots available in the appointments with the latest information
    const spotsRemaining = state.days.map((e) => {
      return getAppointmentsForDay(
        { appointments, days: state.days },
        e.name
      ).filter((e) => e.interview === null).length;
    });

    const days = spotsRemaining.map((e, i) => {
      return { ...state.days[i], spots: e };
    });

    return days;
  };

  const updateAppointments = (id, interview) => {
    // create updates appointments list
    const appointment = {
      ...state.appointments[id],
      interview: interview ? { ...interview } : null,
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const days = updatedDaysSpot(appointments);

    //  update state
    dispatch({ type: SET_INTERVIEW, value: { appointments, days } });
  };

  const bookInterview = (id, interview) => {
    return axios.put(`/api/appointments/${id}`, { interview }).then(() => {
      updateAppointments(id, interview);
    });
  };

  const cancelInterview = (id) => {
    return axios.delete(`/api/appointments/${id}`).then(() => {
      updateAppointments(id, null);
    });
  };

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      dispatch({ type: SET_APPLICATION_DATA, value: all });
    });
  }, []);

  useEffect(() => {
    webSocket.current = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    return () => {
      webSocket.current.close();
    };
  }, []);

  useEffect(() => {
    if (!webSocket.current) {
      return;
    }
    webSocket.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "SET_INTERVIEW") {
        updateAppointments(data.id, data.interview);
      }
    };
  });

  return { state, setDay, bookInterview, cancelInterview };
}
