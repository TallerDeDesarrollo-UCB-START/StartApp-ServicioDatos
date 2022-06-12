const { pool } = require("../config/pool.config");

module.exports = pool;



class DbEventRepository {
  constructor() {
    this.cursor = null;
  }

  async getEvents() {
    return await pool.query("SELECT * FROM public.eventos");
  }
  async getCategories() {
    return await pool.query("SELECT * FROM public.intereses");
  }
  async getAllParticipantsForAnEvent(idEvent) {
    return await pool.query(
    "SELECT us.id_usuario, us.nombre, us.apellido, us.rol, event.nombre_evento, us.telefono, event.hora_inicio,event.hora_fin FROM public.participantes_eventos as eve, public.usuarios as us, public.eventos as event WHERE eve.id_usuario=us.id_usuario AND eve.id_evento=$1 AND event.id=eve.id_evento;",
    [idEvent]
    );
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
    return await pool.query(
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
  }

  async getEvent(data) {
    const { id } = data.params;
    return await pool.query("SELECT * FROM public.eventos WHERE id=$1",[id]);
  }

  async deleteEvent(id) {
    return await pool.query("DELETE FROM public.eventos WHERE id = $1",[id]);
  }

  //Archivar evento
  async updateStateEvent1(data) {
    return await pool.query("UPDATE public.eventos SET estado = 0  WHERE id = $1",[data]);
  }
  //Mostrar Evento
  async updateStateEvent2(data) {
    return await pool.query("UPDATE public.eventos SET estado = 1  WHERE id = $1",[data]);
  }

  async participateInEvent(id, id_autenticacion) {
    const participateEvent = await pool.query("INSERT INTO participantes_eventos(id_usuario, id_evento)VALUES($1,$2)",[id_autenticacion, id]);
    return true;
  }

  //Obtener Id de eventos donde participa un usuario
  async getEventsUser(idUser) {
    return await pool.query("SELECT id_evento FROM participantes_eventos WHERE participantes_eventos.id_usuario = $1;",[idUser]);
  }

  //Eliminar participacion de un evento
  async deleteParticipationAnEvent(idEvent, idUser) {
    return await pool.query("DELETE FROM participantes_eventos WHERE id_evento = $1 AND id_usuario = $2",[idEvent, idUser]);
  }

  async getLeaders() {
    const leaders = await pool.query(
      "SELECT usuarios.rol AS rol, usuarios.nombre AS Nombre,usuarios.apellido AS Apellido FROM usuarios  WHERE usuarios.rol = 'lider'"
    );
    return leaders;
  }

  async getMyEvents(idAuthentication) {
    const UserExist = Boolean(
      (
        await pool.query("SELECT EXISTS(select id_usuario from participantes_eventos where id_usuario=$1)",[idAuthentication])
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
    await pool.query(
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
    return await pool.query("SELECT * FROM eventos WHERE id=$1", [id]);
  }
}

module.exports = DbEventRepository;
