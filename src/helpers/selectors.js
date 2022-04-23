export function getAppointmentsForDay(state, day) {
  let appointmentList = [];

  state.days.forEach((e) => {
    if (e.name === day) {
      e.appointments.forEach((appointmentId) => {
        if (state.appointments[appointmentId]) {
          appointmentList = [
            ...appointmentList,
            state.appointments[appointmentId],
          ];
        }
      });
    }
  });

  return appointmentList;
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  return {
    ...interview,
    interviewer: { ...state.interviewers[interview.interviewer] },
  };
}

export function getInterviewersForDay(state, day) {
  let interviewerList = [];

  state.days.forEach((e) => {
    if (e.name === day) {
      e.interviewers.forEach((interviewerId) => {
        if (state.appointments[interviewerId]) {
          interviewerList = [
            ...interviewerList,
            state.interviewers[interviewerId],
          ];
        }
      });
    }
  });

  return interviewerList;
}
