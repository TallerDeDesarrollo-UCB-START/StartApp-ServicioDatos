class EventoServicio {
  constructor(_repository) {
    this.repository = _repository;
  }
  validar(data) {
    let nombre_evento = data["nombre_evento"];
    try {
      if (nombre_evento == "") {
        throw new Error("Por favor ingrese un nombre del evento");
      }
    } catch (error) {
      return false;
    }
    return true;
  }

  async get_eventos(data) {
    try {
      return await this.repository.get_eventos(data);
    } catch (error) {
      throw error;
    }
  }
  //Obtener eventos de participacion de un usuario
  async get_categorias(data) {
    try {
      return await this.repository.get_categorias(data);
    } catch (error) {
      throw error;
    }
  }

  async get_participantes_eventos(data) {
    try {
      return await this.repository.get_participantes_eventos(data);
    } catch (error) {
      throw error;
    }
  }

  //Eliminar participacion en un evento
  async eliminar_participacion(idEvento, idUsuario) {
    try {
      return await this.repository.eliminar_participacion(idEvento, idUsuario);
    } catch (error) {
      throw error;
    }
  }

  async get_eventos_usuario(data) {
    try {
      return await this.repository.get_eventos_usuario(data);
    } catch (error) {
      throw error;
    }
  }

  async get_evento(data) {
    try {
      var req = await this.repository.get_evento(data);
      //console.error(req.rows)
      // if ( req.rows.length == 0)
      //  throw Error("El evento no existe.");
      return req;
    } catch (error) {
      throw error;
    }
  }

  async create_evento(data) {
    try {
      if (this.validar(data)) {
        return await this.repository.create_evento(data);
      } else {
        throw new Error("El formulario esta incompleto");
      }
    } catch (error) {
      throw error;
    }
  }

  async delete_evento(data) {
    try {
      if (this.validar(data)) {
        return await this.repository.delete_evento(data);
      } else {
        throw new Error("Algo inesperado paso con el repositorio");
      }
    } catch (error) {
      throw error;
    }
  }
  // actualizar estado para archivar
  async update_evento_estado1(data) {
    try {
      if (this.validar(data)) {
        return await this.repository.update_evento_estado1(data);
      } else {
        throw new Error("Algo inesperado paso con el repositorio");
      }
    } catch (error) {
      throw error;
    }
  }
  //actualizar estado para mostrar
  async update_evento_estado2(data) {
    try {
      if (this.validar(data)) {
        return await this.repository.update_evento_estado2(data);
      } else {
        throw new Error("Algo inesperado paso con el repositorio");
      }
    } catch (error) {
      throw error;
    }
  }

  async actualizar_evento(data, id) {
    try {
      if (this.validar(data)) {
        return await this.repository.actualizar_evento(data, id);
      } else {
        throw new Error("Error al actualizar evento!");
      }
    } catch (error) {
      throw error;
    }
  }

  async participate_evento(id, id_autenticacion) {
    try {
      return await this.repository.participate_evento(id, id_autenticacion);
    } catch (error) {
      throw new Error("El " + id.toString() + " del evento no existe.");
    }
  }

  //Obtener Lideres
  async get_lideres(data) {
    try {
      return await this.repository.get_lideres(data);
    } catch (error) {
      throw error;
    }
  }

  //Obtener participaciones en eventos de 1 voluntario
  async get_my_eventos(id_autenticacion) {
    try {
      let list_of_participant = await this.repository.get_my_eventos(
        id_autenticacion
      );
      let sorted_list = list_of_participant.rows.sort((a, b) => {
        return new Date(a.fecha_evento) - new Date(b.fecha_evento);
      });
      sorted_list = sorted_list.sort((a, b) => {
        return a.hora_inicio - b.hora_inicio;
      });
      sorted_list = sorted_list.filter((event) => {
        let today = new Date();
        return !(new Date(event.fecha_evento) < today);
      });
      return sorted_list;
    } catch (error) {
      throw new Error("Algo inesperado paso con la Base de datos o el id del participante no existe");
    }
  }
}
module.exports = EventoServicio;
