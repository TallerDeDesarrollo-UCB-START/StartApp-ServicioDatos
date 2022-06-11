const { pool } = require("../config/pool.config");

module.exports = pool;



class DbEventRepository {
  constructor() {
    this.cursor = null;
  }

  async getEvents(data) {
    const events = await pool.query(
      "SELECT * FROM public.eventos"
      );
    return events;
  }
  async getCategories(data) {
    const categories = await pool.query(
      "SELECT * FROM public.intereses"
      );
    return categories;
  }
  async getAllParticipantsForEvent(idEvent) {
    const participantsAnEvent = await pool.query(
      "SELECT us.id_usuario, us.nombre, us.apellido, us.rol, event.nombre_evento, us.telefono, event.hora_inicio, event.hora_fin FROM public.participantes_eventos as eve, public.usuarios as us, public.eventos as event WHERE eve.id_usuario=us.id_usuario AND eve.id_evento=$1 AND event.id=eve.id_evento;",
      [idEvent]
    );
    return participantsAnEvent;
  }
  async createEvent(data) {
    const {
      nombre_evento,
      descripcion_evento,
      modalidad_evento,
      lugar_evento,
      fecha_evento,
      proyecto,
      estado,
      categoria,
      hora_inicio,
      hora_fin,
      lider,
    } = data;
    const new_evento = await pool.query(
      "INSERT INTO public.eventos(nombre_evento,descripcion_evento,modalidad_evento,lugar_evento,fecha_evento,proyecto,estado,categoria,hora_inicio,hora_fin,lider) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
      [
        nombre_evento,
        descripcion_evento,
        modalidad_evento,
        lugar_evento,
        fecha_evento,
        proyecto,
        estado,
        categoria,
        hora_inicio,
        hora_fin,
        lider,
      ]
    );
    return new_evento;
  }

  async getEvent(data) {
    const { id } = data.params;
    const event = await pool.query(
      "SELECT * FROM public.eventos WHERE id=$1",
      [id]
    );
    return event;
  }

  async deleteEvent(id) {
    const deleteEvent = await pool.query(
      "DELETE FROM public.eventos WHERE id = $1",
      [id]
    );
    return deleteEvent;
  }
  //Archivar evento
  async updateStateEvent1(data) {
    const updateState = await pool.query(
      "UPDATE public.eventos SET estado = 0  WHERE id = $1",
      [data]
    );
    return updateState;
  }
  //Mostrar Evento
  async updateStateEvent2(data) {
    const updateState = await pool.query(
      "UPDATE public.eventos SET estado = 1  WHERE id = $1",
      [data]
    );
    return updateState;
  }

  async participateEvent(id, id_autenticacion) {
    const participateEvent = await pool.query(
      "INSERT INTO participantes_eventos(id_usuario, id_evento)VALUES($1,$2)",
      [id_autenticacion, id]
    );
    return true;
  }

  //Obtener Id de eventos donde participa un usuario

  async getEventsUser(idUser) {
    const eventsAnUser = await pool.query(
      "SELECT id_evento FROM participantes_eventos WHERE participantes_eventos.id_usuario = $1;",
      [idUser]
    );
    return eventsAnUser;
  }

  //Eliminar participacion de un evento
  async deleteParticipationAnEvent(idEvent, idUser) {
    const deleteParticipacion = await pool.query(
      "DELETE FROM participantes_eventos WHERE id_evento = $1 AND id_usuario = $2",
      [idEvent, idUser]
    );
    return deleteParticipacion;
  }

  async getLeaders(data) {
    const leaders = await pool.query(
      "SELECT usuarios.rol AS rol, usuarios.nombre AS Nombre,usuarios.apellido AS Apellido FROM usuarios  WHERE usuarios.rol = 'lider'"
    );
    return leaders;
  }

  async getMyEvents(idAuthentication) {
    const UserExist = Boolean(
      (
        await pool.query(
          "SELECT EXISTS(select id_usuario from participantes_eventos where id_usuario=$1)",
          [idAuthentication]
        )
      ).rows[0]["exists"]
    );
    if (UserExist) {
      const myEvents = await pool.query(
        "select * from eventos e where exists (select par.id_evento from participantes_eventos par where par.id_usuario=$1 and e.id=par.id_evento)",
        [idAuthentication]
      );
      return myEvents;
    }
    return UserExist;
  }

  async updateEvent(id, data) {
    const {
      nombre_evento,
      descripcion_evento,
      modalidad_evento,
      lugar_evento,
      fecha_evento,
      proyecto,
      estado,
      categoria,
      hora_inicio,
      hora_fin,
      lider,
    } = data;
    const updateEvent = await pool.query(
      "UPDATE public.eventos SET nombre_evento=$2, descripcion_evento=$3, modalidad_evento= $4, lugar_evento=$5,fecha_evento=$6,proyecto=$7,estado=$8,categoria=$9,hora_inicio=$10, hora_fin=$11, lider=$12 WHERE id=$1",
      [
        id,
        nombre_evento,
        descripcion_evento,
        modalidad_evento,
        lugar_evento,
        fecha_evento,
        proyecto,
        estado,
        categoria,
        hora_inicio,
        hora_fin,
        lider,
      ]
    );
    const event = await pool.query(
      "SELECT * FROM eventos WHERE id=$1", 
      [id]
      );

    return event;
  }
}

module.exports = DbEventRepository;
