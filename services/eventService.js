class EventService {
  constructor(_repository) {
    this.repository = _repository;
  }

  validate(data) {
    let answer=true;
    try {
      if (this.checkValidateNameEvent(data)) {
        throw new Error("Por favor ingrese un nombre del evento");
      }
    } catch (error) {
      console.error(error.message);
      answer=false;
    }
    return answer;
  }

  checkValidateNameEvent(data){
    let nameEvent=data["nombre_evento"]
    return nameEvent==""? true : false  

  }

  async getEvents(data) {
    return await this.repository.getEvents(data);
  }
  async getCategories(data) {
    return await this.repository.getCategories(data);
  }

  async getAllParticipantsForAnEvent(data) {
    return await this.repository.getAllParticipantsForAnEvent(data);
  }

  //Eliminar participacion en un evento
  async deleteParticipationAnEvent(idEvento, idUsuario) {
    try {
      return await this.repository.deleteParticipationAnEvent(idEvento, idUsuario);
    } catch (error) {
      return new Error("Error al eliminar participacion");
    }
  }

  async getEventsUser(data) {
    return await this.repository.getEventsUser(data);
  }

  async getEvent(data) {
    return await this.repository.getEvent(data);
  }

  async createEvent(data) {
    try {
      if (this.validate(data)) {
        return await this.repository.createEvent(data);
      } else {
        throw new Error("Algo inesperado paso con el repositorio"); 
      }
    } catch (error) {
      console.error(error.message);
      return error;
    }
  }

  async deleteEvent(data) {
    try {
      if (this.validate(data)) {
        return await this.repository.deleteEvent(data);
      } else {
        throw new Error("Algo inesperado paso con el repositorio");
      }
    } catch (error) {
      console.error(error.message);
      return error;
    }
  }
  // actualizar estado para archivar
  async update_evento_estado1(data) {
    try {
      if (this.validate(data)) {
        return await this.repository.updateStateEvent1(data);
      } else {
        throw new Error("Algo inesperado paso con el repositorio");
      }
    } catch (error) {
      console.error(error.message);
      return error;
    }
  }
  //actualizar estado para mostrar
  async updateStateEvent2(data) {
    try {
      if (this.validate(data)) {
        return await this.repository.updateStateEvent2(data);
      } else {
        throw new Error("Algo inesperado paso con el repositorio");
      }
    } catch (error) {
      console.error(error.message);
      return error;
    }
  }

  async updateEvent(data, id) {
    try {
      if (this.validate(data)) {
        return await this.repository.updateEvent(data, id);
      } else {
        throw new Error("Error al actualizar evento!");
      }
    } catch (error) {
      console.error(error.message);
      return error;
    }
  }

  async participateInEvent(id, id_autenticacion) {
    try {
      return await this.repository.participateInEvent(id, id_autenticacion);
    } catch (error) {
      throw new Error("El " + id.toString() + " del evento no existe");  
    }
  }

  //Obtener Lideres
  async getLeaders(data) {
    return await this.repository.getLeaders(data);
  }

  //Obtener participaciones en eventos de 1 voluntario
  async getMyEvents(id_autenticacion) {
    try {
      let list_of_participant = await this.repository.getMyEvents(
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
      throw new Error("Algo inesperado paso con la Base de datos o el id del participante no existe" );
    }
  }
}
module.exports = EventService;
