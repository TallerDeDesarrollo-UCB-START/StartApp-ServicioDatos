const ServiceEvento = require("../services/eventoServicio");
const Repository = require("../data/dbEventoRepositorio.js");
const service_evento = new ServiceEvento(new Repository());

module.exports = function (app) {
  app.post("/eventos/crearevento", async (req, res) => {
    //Crear
    try {
      const nuevoEvento = await service_evento.createEvent(req.body);
      res.status(201).json(req.body);
    } catch (error) {
      res.status(400).send(`{"message":"Cambios no fueron guardados, ${error.message}", "data":false}`);
    }
  });

  app.get("/eventos", async (req, res) => {
    try {
      const nuevoProyecto = await service_evento.getEvents(req);
      res.status(200).json(nuevoProyecto.rows);
    } catch (error) {
      res.status(404).send(`{"message":"No se pudo obtener los eventos, ${error.message}", "data":false}`);
    }
  });

  app.get("/eventos/categorias", async (req, res) => {
    try {
      const categorias = await service_evento.getCategories(req);
      res.status(200).json(categorias.rows);
    } catch (error) {
      res.status(404).send(`{"message":"No se pudo obtener las categorias de eventos, ${error.message}", "data":false}`);
    }
  });

  app.get("/eventos/participantes/:id", async (req, res) => {
    try {
      const participantes_eventos =
        await service_evento.getAllParticipantsForEvent(req.params["id"]);
      res.status(200).json(participantes_eventos.rows);
    } catch (error) {
      res.status(404).send(`{"message":"No se pudo obtener los participantes del evento con id ${req.params["id"]}, ${error.message}", "data":false}`);
    }
  });

  app.get("/eventos/:id", async (req, res) => {
    try {
      const nuevoEvento = await service_evento.getEvent(req);
      res.status(200).json(nuevoEvento.rows);
    } catch (error) {
      res.status(404).send(`{"message":"No se pudo obtener el evento con el id ${req.params["id"]}, ${error.message}", "data":false}`);
    }
  });
  app.post(
    "/eventos/participate_evento/:id/sesion/:id_autenticacion",
    async (req, res) => {
      try {
        const { id, id_autenticacion } = req.params;
        const evento_a_actualizar = await service_evento.participateEvent(
          id,
          id_autenticacion
        );
        res.status(200).json(true);
      } catch (error) {
        res.status(400).send(`{"message":"No se pudo participar en el evento con el id ${req.params["id"]}, ${error.message}", "data":false}`);
      }
    }
  );

  app.delete("/eventos/:id", async (req, res) => {
    try {
      let { id } = req.params;
      const eliminarEvento = await service_evento.deleteEvent(id, req.body);
      res.status(200).json(eliminarEvento.rows);
    } catch (error) {
      res.status(404).send(`{"message":"No se pudo eliminar el evento con el id ${req.params["id"]}, ${error.message}", "data":false}`);
    }
  });

  app.put("/eventos/archivar_evento/:id", async (req, res) => {
    try {
      let { id } = req.params;
      const archivarEvento = await service_evento.updateStateEvent1(
        id,
        req.body
      );
      res.status(200).json(archivarEvento.rows);
    } catch (error) {
      res.status(404).send(`{"message":"No se pudo editar el evento con el id ${req.params["id"]}, ${error.message}", "data":false}`);
    }
    try {
      const changedVolunteer = await service_form.do_changes(id, req.body);
      let data_to_send = JSON.stringify(changedVolunteer.rows[0]);
      res
        .status(202)
        .send(`{"message":"Actualizado exitosamente!", "data": ${data_to_send}}`);
    } catch (error) {
      res
        .status(400)
        .send(`{"message":"Cambios no fueron guardados", "data":false}`);
    }
  });

  //Mostrar
  app.put("/eventos/mostrar_evento/:id", async (req, res) => {
    try {
      let { id } = req.params;
      const archivarEvento = await service_evento.updateStateEvent2(
        id,
        req.body
      );
      res.status(200).json(archivarEvento.rows);
    } catch (error) {
      res.status(400).send(`{"message":"No se pudo editar el mostrar evento con el id ${req.params["id"]}, ${error.message}", "data":false}`);
    }
  });

  app.get("/eventos/participante/:id", async (req, res) => {
    try {
      const eventosDelUsuario = await service_evento.getEventsUser(
        req.params["id"]
      );
      res.status(200).json(eventosDelUsuario.rows);
    } catch (error) {
      res.status(404).send(`{"message":"No se pudo obtener los eventos del usuario con id ${req.params["id"]}, ${error.message}", "data":false}`);
    }
  });

  app.get("/lideres", async (req, res) => {
    try {
      const lideres = await service_evento.getLeaders(req);
      res.status(200).json(lideres.rows);
    } catch (error) {
      res.status(404).send(`{"message":"No se pudo obtener los lideres, ${error.message}", "data":false}`);
    }
  });

  app.delete(
    "/eventos/eliminar_participacion/:idEvento/:idUsuario",
    async (req, res) => {
      try {
        const { idEvento, idUsuario } = req.params;
        const eliminarParticipacion =
          await service_evento.deleteParticipationAnEvent(idEvento, idUsuario);
        res.status(200).json(eliminarParticipacion.rows);
      } catch (error) {
        res.status(404).send(`{"message":"No se pudo eliminar la participacion del usuari con id ${req.params["idUsuario"]}, ${error.message}", "data":false}`);
      }
    }
  );


  app.get("/sesion/:id_autenticacion/get_my_eventos", async (req, res) => {
    try {
      const { id_autenticacion } = req.params;
      const mis_eventos = await service_evento.getMyEvents(id_autenticacion);
      if (!mis_eventos)
        res
          .status(204)
          .send(
            "El usuario con id : " +
              parseInt(id_autenticacion).toString() +
              " no tiene participaciones en los eventos."
          );
      else {
        res.status(200).json(mis_eventos);
      }
    } catch (error) {
      res.status(404).send(`{"message":"No se pudo obtener los eventos de usuario con el id ${req.params["id_autenticacion"]}", "data":false}`);
    }
  });

  app.put("/actualizar_evento/:id", async (req, res) => {
    try {
      let { id } = req.params;
      req.body["id"] = id;
      const eventoActualizado = await service_evento.updateEvent(
        id,
        req.body
      );
      res.status(200).json(eventoActualizado.rows);
    } catch (error) {
      res.status(404).send(`{"message":"No se pudo editar los eventos con el id ${req.params["id"]}, ${error.message}", "data":false}`);
    }
  });
};
