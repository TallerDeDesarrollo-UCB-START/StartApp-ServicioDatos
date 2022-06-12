const DbUsuarioRepositorio = require("../data/dbUsuarioRepositorio.js");
class usuarioServicio {
  constructor() {
    this.repository = new DbUsuarioRepositorio();
  }

  async get_volunteer_data(id) {
    try{
      return await this.repository.GetUsuario(id);
    } catch(error){
      console.error(error);
      throw error;
    }
  }
  async get_volunteers_data() {
    try{
      return await this.repository.GetUsuarios();
    } catch(error){
      console.error(error);
      throw error;
    }
  }
  async register_changes(data) {
    try {
      data.rol = "voluntario";
      data.estado_de_cuenta = "activa";
      data.estado_de_disponibilidad = "disponible";
      return await this.repository.CreateUsuario(data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async do_changes(id, data) {
    try {
      const usuario_a_editar = (await this.repository.GetUsuario(id)).rows[0];
      const data_update = this.completar_form_a_actualizar(
        usuario_a_editar,
        data
      );
      return await this.repository.UpdateUsuario(id, data_update);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async disable_user(id) {
    try {
      return await this.repository.disableUser(id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async get_insignias_by_user(id_user) {
    try {
      return await this.repository.GetInsigniasByIdUsuario(id_user);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async update_insignias_by_user_id(id, data) {
    try {
      return await this.repository.UpdateInsignias(id, data.insignias);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async get_insignias() {
    try {
      return await this.repository.GetInsignias();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  completar_form_a_actualizar(usuario_a_editar, data) {
    try {
      for (const prop in usuario_a_editar) {
        if (!data.hasOwnProperty(`${prop}`)) {
          if (prop === "id_usuario") continue; // Este campo no debe estar en el json
          if (prop === "intereses") {
            data[prop] = usuario_a_editar[prop].join(",");
            continue;
          }
          if (prop === "cualidades") {
            data[prop] = usuario_a_editar[prop].join(",");
            continue;
          }
          if (prop === "aptitudes_tecnicas") {
            data[prop] = usuario_a_editar[prop].join(",");
            continue;
          }
          data[prop] = usuario_a_editar[prop];
          continue;
        }
      }
      if (data.fecha_de_nacimiento === "") {
        data.fecha_de_nacimiento = null;
      }
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
module.exports = usuarioServicio;