const UsuarioServicio = require("../services/usuarioServicio");
const usuarioService = new UsuarioServicio();

module.exports = function (app) {
  app.post("/extended_form", async (req, res) => {
    try {
      const newVolunteer = await usuarioService.register_changes(req.body);
      let data_to_send = JSON.stringify(newVolunteer.rows[0]);
      res
        .status(201)
        .send(
          `{"message":"La informacion del usuario fue agregada", "data": ${data_to_send}}`
        );
    } catch (error) {
      res
        .status(400)
        .send(`{ "message": ${error}, "data": ""}`);
    }
  });

  app.put("/extended_form/:id", async (req, res) => {
    try {
      let { id } = req.params;
      const changedVolunteer = await usuarioService.do_changes(id, req.body);
      let data_to_send = JSON.stringify(changedVolunteer.rows[0]);
      res
        .status(202)
        .send(`{"message":"Actualizacion exitosa!", "data": ${data_to_send}}`);
    } catch (error) {
      res
        .status(400)
        .send(`{"message":"Los cambios no fueron exitosos.", "data":false}`);
    }
  });

  app.get("/extended_form/:id", async (req, res) => {
    try {
      const newVolunteer = await usuarioService.get_volunteer_data(
        req.params.id
      );
      let data_to_send = JSON.stringify(newVolunteer.rows[0]);
      res.status(200).send(`{"message":"", "data": ${data_to_send}}`);
    } catch (err) {
      console.error(err.message);
      res
        .status(204).status(204)
        .send(
          `{ "message": "El voluntario con id ${req.params.id} no existe"", "data": ""}`
        );
    }
  });

  app.get("/extended_form", async (req, res) => {
    try {
      const volunteers = await usuarioService.get_volunteers_data();
      let data_to_send = JSON.stringify(volunteers.rows);
      const elem = {
        message : "",
        data : volunteers.rows
      }
      res.status(200).json(elem);
    } catch (err) {
      console.error(err.message);
      res.status(404).send(`{ "message": "No hay usuarios", "data": ""}`);
    }
  });

  app.get("/insignias/:id", async (req, res) => {
    try {
      const insignias = await usuarioService.get_insignias_by_user(
        req.params.id
      );

      let data_to_send = JSON.stringify(insignias);
      res.status(200).send(`{"message":"", "data": ${data_to_send}}`);
    } catch (err) {
      res
        .status(404).send(`{ "message": "El usuario con id ${req.params.id} no existe"", "data": ""}`);
    }
  });

  app.get("/insignias", async (req, res) => {
    try {
      const insignias = await usuarioService.get_insignias();

      let data_to_send = JSON.stringify(insignias.rows);
      res.status(200).send(`{"message":"", "data": ${data_to_send}}`);
    } catch (error) {
      res.status(404).send(`{ "message": "No se pudo recuperar las insignias, ${error.message}"", "data": ""}`);
    }
  });

  app.put("/insignias/:id_user", async (req, res) => {
    try {
      let { id_user } = req.params;
      const changedVolunteer = await usuarioService.update_insignias_by_user_id(
        id_user,
        req.body
      );
      let data_to_send = JSON.stringify(changedVolunteer);
      res
        .status(202)
        .send(`{"message":"Actualizado exitosamente!", "data": ${data_to_send}}`);
    } catch (error) {
      res.status(400).send(`{"message":"Cambios no fueron guardados, ${error.message}", "data":false}`);
    }
  });
  app.delete("/disable_user/:id", async (req, res) => {
    try {
      let stateOfDisable = await usuarioService.disable_user(req.params.id);
      if (stateOfDisable) {
        res
          .status(205)
          .send(
            `{"message":"Usuario fue desahabilitado exitosamente.", "data": ${stateOfDisable}}`
          );
      } else {
        res
          .status(500)
          .send(`{"message":"Usuario no fue desahabilitado.", "data": ${stateOfDisable}}`);
      }
    } catch (error) {
      res
        .status(400)
        .send(`{"message":"Cambios no fueron guardados, ${error.message}", "data":false}`);
    }
  });
};