import { useEffect, useReducer } from "react";
import axios from "axios";
import { getAppointmentsForDay } from "helpers/selectors";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const SET_SPOTS = "SET_SPOTS";

export default function useApplicationData() {
  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY: {
        return { ...state, day: action.value };
      }
      case SET_APPLICATION_DATA: {
        return {
          ...state,
          days: action.value[0].data,
          appointments: action.value[1].data,
          interviewers: action.value[2].data,
        };
      }
      case SET_INTERVIEW: {
        return {
          ...state,
          appointments: action.value,
        };
      }
      case SET_SPOTS: {
        return {
          ...state,
          days: action.value,
        };
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => dispatch({ type: SET_DAY, value: day });

  function updatedDaysSpot(appointments) {
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
    const days = [...state.days].map((e, i) =>
      i === indexToUpdateSlots ? newDay : e
    );

    return days;
  }

  function updateAppointments(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: interview ? { ...interview } : null,
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    dispatch({ type: SET_INTERVIEW, value: appointments });
    dispatch({ type: SET_SPOTS, value: updatedDaysSpot(appointments) });
  }

  function bookInterview(id, interview) {
    return axios.put(`/api/appointments/${id}`, { interview }).then(() => {
      updateAppointments(id, interview);
    });
  }

  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`).then(() => {
      updateAppointments(id, null);
    });
  }

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      dispatch({ type: SET_APPLICATION_DATA, value: all });
    });
  }, []);

  return { state, setDay, bookInterview, cancelInterview };
}
