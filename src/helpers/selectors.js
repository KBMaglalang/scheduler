export function getAppointmentsForDay(state, day) {
  let appointmentList = [];
  
  state.days.forEach(e => {
    if(e.name === day) {
      e.appointments.forEach(appointmentId => {
        if(state.appointments[appointmentId]) {
          appointmentList = [...appointmentList, state.appointments[appointmentId]];
        }
      })
    }
  });

  return appointmentList;
}