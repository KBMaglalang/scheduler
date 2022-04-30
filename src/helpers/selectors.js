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

  /* 
    ! SUPPOSED TO BE A BETTER METHOD AND NESTED FOR LOOPS - AVOID DOING THIS
  ! const found = state.days.find(d => day === d.name);
  !if (state.days.length === 0 || found === undefined) return [];
  !return found.appointments.map(id => state.appointments[id]);
  */

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
