const _repository = require("../data/dbProyectoRepositorio.js");

class ProyectoServicio {
  constructor() {
    this.repository = new _repository();
  }
  validar(data) {
    let nombre_proyecto = data["titulo"];
    try {
      if (nombre_proyecto == "") {
        throw new Error("Por favor ingrese el nombre del proyecto.");
      }
    } catch (error) {
      throw error;
    }
    return true;
  }
  convertir_fecha(data) {
    var fecha = data.toLocaleDateString("en-GB");
    return fecha;
  }

  sin_nulls(array) {
    if (array.titulo == null) {
      array.titulo = "";
    }
    if (array.descripcion == null) {
      array.descripcion = "";
    }
    if (array.objetivo == null) {
      array.objetivo = "";
    }
    if (array.lider == null) {
      array.lider = "";
    }
    if (array.numero_participantes == null) {
      array.numero_participantes = "";
    }
    if (array.fecha_inicio == null) {
      array.fecha_inicio = "";
    }
    if (array.fecha_fin == null) {
      array.fecha_fin = "";
    }
    if (array.categoria_id == null) {
      array.categoria_id = "";
    }
    if (array.estado == null) {
      array.estado = "";
    }
    if (array.visualizar == null) {
      array.visualizar = "";
    }
    if (array.informacion_adicional == null) {
      array.informacion_adicional = "";
    }
    if (array.url_imagen == null) {
      array.url_imagen = "";
    }
    return array;
  }
  async get_proyectos(data) {
    try {
      var resultado = await this.repository.get_proyectos(data);
      return resultado;
    } catch (error) {
      throw error;
    }
  }
  async get_proyecto(data) {
    try {
      var proyecto = await this.repository.get_proyecto(data);
      if (proyecto.rows.length > 0) {
        return proyecto;
      } else {
        throw new Error("No se hallo ningun proyecto con ese id.");
      }
    } catch (error) {
      throw error;
    }
  }

  async create_proyecto(data) {
    try {
      if (this.validar(data)) {
        var proyecto = await this.repository.create_proyecto(data);
        return proyecto;
      } else {
        throw new Error("Algo inesperado paso en la base de datos");
      }
    } catch (error) {
      throw error;
    }
  }

  async update_proyecto(id, data) {
    try {
      if (this.validar(data)) {
        var proyecto = await this.repository.update_proyecto(id, data);
        return proyecto;
      } else {
        console.error("Algo inesperado paso en la base de datos");
        return null;
      }
    } catch (error) {
      return error;
    }
  }
  
  async participate_proyecto(id, id_autenticacion) {
    try {
      return await this.repository.participate_proyecto(id, id_autenticacion);
    } catch (error) {
      throw new Error("Algo inesperado paso con la Base de datos o el id del proyecto o participante no existe.");
    }
  }
  async participation(id, id_autenticacion) {
    try {
      return await this.repository.participation(id, id_autenticacion);
    } catch (error) {
      throw new Error("Algo inesperado paso con la Base de datos o el id del proyecto o participante no existe");
    }
  }

  async delete_proyecto(id) {
    try {
      return await this.repository.delete_proyecto(id);
    } catch (error) {
      throw new Error("El Proyecto " + id.toString() + " No existe.");
    }
  }
  async get_participantes_proyecto_simple(id) {
    try {
      const validar = await this.repository.get_participantes_proyecto_simple(
        id
      );
      return validar;
    } catch (error) {
      throw error;
    }
  }
  async get_categorias_proyectos(data) {
    try {
      return await this.repository.get_categorias_proyectos(data);
    } catch (error) {
      throw error;
    }
  }
  async get_categorias() {
    return await this.repository.get_categorias();
  }

  async cancel_participate_proyecto(id, id_autenticacion) {
    try {
      return await this.repository.cancel_participate_proyecto(
        id,
        id_autenticacion
      );
    } catch (error) {
      throw new Error("Algo inesperado paso con la Base de datos o el id del proyecto o participante no existe");
    }
  }

  async get_my_proyectos(id_autenticacion) {
    try {
      var resultado = await this.repository.get_my_proyectos(id_autenticacion);
      return resultado;
    } catch (error) {
      throw new Error("Algo inesperado paso con la Base de datos o el id del participante no existe");
    }
  }

  async get_lideres() {
    try {
      return await this.repository.get_lideres();
    } catch (error) {
      throw error;
    }
  }

  async get_roles() {
    try {
      return await this.repository.get_roles();
    } catch (error) {
      throw error;
    }
  }

  async get_rol(id_autenticacion) {
    try {
      return await this.repository.get_rol(id_autenticacion);
    } catch (error) {
      throw new Error(`Algo inesperado paso con la Base de datos ${error.message}`);
    }
  }

  async get_numero_participantes(id_proyecto) {
    try {
      return await this.repository.get_numero_participantes(id_proyecto);
    } catch (error) {
      throw new Error(`Algo inesperado paso con la Base de datos ${error.message}`);
    }
  }
  async get_eventos_proyecto(id_proyecto) {
    try {
      return await this.repository.get_eventos_proyecto(id_proyecto);
    } catch (error) {
      throw new Error(`Algo inesperado paso con la Base de datos ${error.message}`);
    }
  }

  async get_proyectos_acabado() {
    try {
      var resultado = await this.repository.get_proyectos_acabado();
      return resultado;
    } catch (error) {
      throw new Error(`Algo inesperado paso con la Base de datos ${error.message}`);
    }
  }

  async get_proyectos_pasados_categoria(data) {
    try {
      let resultado = await this.repository.get_proyectos_pasados_categoria(data);
      return resultado;
    } catch (error) {
      throw new Error(`Algo inesperado paso con la Base de datos ${error.message}`);
    }
  }

  async participate_past_proyecto(id_proyecto, id_autenticacion, id_usuario) {
    try {
      return await this.repository.participate_past_proyecto(
        id_proyecto,
        id_autenticacion,
        id_usuario
      );
    } catch (error) {
      throw new Error(`Algo inesperado paso con la Base de datos ${error.message}`);
    }
  }
  async get_usuarios() {
    try {
      return await this.repository.get_usuarios();
    } catch (error) {
      throw new Error(`Algo inesperado paso con la Base de datos ${error.message}`);
    }
  }

  async create_imagen(filename, mimetype, size, filepath, id_proyecto) {
    try {
      return await this.repository.create_imagen(
        filename,
        mimetype,
        size,
        filepath,
        id_proyecto
      );
    } catch (error) {
      throw new Error(`Algo inesperado paso con la Base de datos ${error.message}`);
    }
  }

  async get_imagen(id_proyecto) {
    try {
      return await this.repository.get_imagen(id_proyecto);
    } catch (error) {
      throw new Error(`Algo inesperado paso con la Base de datos ${error.message}`);
    }
  }

  async get_lista_eventos_para_proyectos(id_proyecto) {
    try {
      return await this.repository.get_lista_eventos_para_proyectos(id_proyecto);
    } catch (error) {
      throw new Error(`Algo inesperado paso con la Base de datos ${error.message}`);
    }
  }

  async get_lista_por_proyecto(proyecto) {
    try {
      return await this.repository.get_lista_por_proyecto(proyecto);
    } catch (error) {
      throw new Error(`Algo inesperado paso con la Base de datos ${error.message}`);
    }
  }
}
module.exports = ProyectoServicio;
