const Pool = require("pg").Pool;

const pool = new Pool({
  user: "hsazteibnsnquc",
  password: "96c44f19b6a31a67521c2fa65c9233544ed1d7d5388367c6d9ff4c22c940a340", //use your pass my friend
  database: "d5mjf648gc2p7f",
  host: "ec2-54-156-24-159.compute-1.amazonaws.com",
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
class DbProyectoRepositorio {
  constructor() {
    this.cursor = null;
  } 

  async get_proyectos(data) {
    const proyectos = await pool.query(
      `SELECT p.*, tipo as categoria 
      FROM proyectos as p 
	    INNER JOIN categoria_proyectos 
      ON p.categoria_id = categoria_proyectos.id
	    WHERE p.estado=true`
    );
    return proyectos;
  }
  async get_proyecto(data) {
    const { id } = data.params;
    const proyecto = await pool.query(
      `SELECT p.*, tipo as categoria 
      FROM proyectos as p 
      INNER JOIN categoria_proyectos 
      ON p.categoria_id = categoria_proyectos.id 
      WHERE p.id=$1 `,
      [id]
    );
    return proyecto;
  }

  async create_proyecto(data) {
    debugger
    const {
      titulo,
      descripcion,
      objetivo,
      lider,
      numero_participantes,
      estado,
      categoria,
      informacion_adicional
    } = data;
    let numero_participantes_oficial = numero_participantes;
    if (numero_participantes_oficial == null) {
      numero_participantes_oficial = 0;
    }    
    const categoria_db = await pool.query(
      "SELECT * FROM public.categoria_proyectos WHERE tipo = $1",
      [categoria]
    );
    const categoria_id = (categoria_db.rowCount > 0) ? categoria_db.rows[0].id : null;
    var visualizar=true;
    const new_proyeto = await pool.query(
      "INSERT INTO proyectos(titulo, descripcion, objetivo, lider, numero_participantes, estado, fecha_inicio,categoria_id,visualizar,informacion_adicional)VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9,$10)",
      [
        titulo,
        descripcion,
        objetivo,
        lider,
        numero_participantes_oficial,
        estado || true,
        new Date(),
        categoria_id,
        visualizar,
        informacion_adicional
      ]      
    );    
    const proyecto_to_show = await pool.query(
      "SELECT p.*, tipo as categoria FROM proyectos as p INNER JOIN categoria_proyectos ON p.categoria_id = categoria_proyectos.id  WHERE estado=true ORDER BY ID DESC LIMIT 1"
    );    
    return proyecto_to_show;
  }

  async update_proyecto(id, data) {
    const {
      titulo,
      descripcion,
      objetivo,
      lider,
      numero_participantes,
      estado,
      categoria,
      visualizar,
      informacion_adicional
    } = data;
    const categoria_db = await pool.query(
      "SELECT * FROM public.categoria_proyectos WHERE tipo = $1",
      [categoria]
    );
    var categoria_id;
    const categorias_id = (categoria_db.rowCount > 0) ? categoria_db.rows[0].id : null;
    if (categorias_id==null)
    {
      var categoria_id_oficial = await pool.query(
        "SELECT categoria_id FROM public.proyectos WHERE id = $1",
        [id]
      );
      categoria_id=categoria_id_oficial.rows[0].categoria_id
    }
    else
    {
      categoria_id=categorias_id
    }
    
    if(estado!=undefined)
    {
      var fecha_fin = estado ? null : new Date();
    }
    
    if (fecha_fin==null && estado==true)
    {
      const proyecto_a_actualizar = await pool.query(
        "UPDATE proyectos SET titulo=coalesce($2,titulo), descripcion=coalesce($3,descripcion), objetivo=coalesce($4,objetivo), lider=coalesce($5,lider),numero_participantes=coalesce($6,numero_participantes),estado=coalesce($7,estado), fecha_fin=$8, categoria_id=coalesce($9,categoria_id), visualizar=coalesce($10,visualizar), informacion_adicional=coalesce($11,informacion_adicional) WHERE id = $1",
        [
          id,
          titulo,
          descripcion,
          objetivo,
          lider,
          numero_participantes,
          estado,
          fecha_fin,
          categoria_id,
          visualizar,
          informacion_adicional
        ]
      );
    }
    else
    {
      const proyecto_a_actualizar = await pool.query(
        "UPDATE proyectos SET titulo=coalesce($2,titulo), descripcion=coalesce($3,descripcion), objetivo=coalesce($4,objetivo), lider=coalesce($5,lider), numero_participantes=coalesce($6,numero_participantes), estado=coalesce($7,estado), fecha_fin=coalesce($8,fecha_fin), categoria_id=coalesce($9,categoria_id),  visualizar=coalesce($10,visualizar), informacion_adicional=coalesce($11,informacion_adicional) WHERE id = $1",
        [
          id,
          titulo,
          descripcion,
          objetivo,
          lider,
          numero_participantes,
          estado,
          fecha_fin,
          categoria_id,
          visualizar,
          informacion_adicional
        ]
      );

    }
    const proyecto = await pool.query(
      "SELECT p.*, tipo as categoria FROM proyectos as p INNER JOIN categoria_proyectos ON p.categoria_id = categoria_proyectos.id WHERE p.id=$1", 
      [id]
    );

    return proyecto;
  }


  async participate_proyecto(id, id_usuario) {
    //si existe un usuario no tiene que aumentar

    const res1 = Boolean(
      (
        await pool.query(
          "SELECT EXISTS(select id_usuario from usuarios where id_usuario=$1)",
          [id_usuario]
        )
      ).rows[0]["exists"]
    );
    const res = Boolean(
      (
        await pool.query(
          "SELECT NOT EXISTS( SELECT id_usuario FROM participantes_proyectos WHERE id_usuario=$1 and id_proyecto=$2)",
          [id_usuario, id]
        )
      ).rows[0]["?column?"]
    );
    if (res && res1) {
      const participate_proyecto = await pool.query(
        "INSERT INTO participantes_proyectos(id_usuario, id_proyecto)VALUES((select id_usuario from usuarios where id_usuario=$1),$2)",
        [id_usuario, id]
      );
      debugger
      const incrementar_participantes = await pool.query(
        "UPDATE proyectos SET numero_participantes=numero_participantes+1 WHERE id=$1",
        [id]);
    }
    return res && res1;
  }

  async participation(id, id_autenticacion) {
    const res1 = Boolean(
      (
        await pool.query(
          "SELECT EXISTS(select id_participantes_proyectos from participantes_proyectos where id_usuario=$1 and id_proyecto=$2)",
          [id_autenticacion, id]
        )
      ).rows[0]["exists"]
    );
    return res1;
  }

  async delete_proyecto(id) {
    const proyecto_a_eliminar = await pool.query(
      "DELETE FROM proyectos WHERE id = $1",
      [id]
    );
    const eliminar_voluntarios_proyecto = await pool.query(
      "DELETE FROM public.participantes_proyectos WHERE id_proyecto = $1",
      [id]
    );
    return proyecto_a_eliminar;
  }
  async get_participantes_proyecto_simple(id) {
    const existeProyecto = Boolean(
      (
        await pool.query(
          "SELECT EXISTS(select id from public.proyectos where id=$1)",
          [id]
        )
      ).rows[0]["exists"]
    );

    if (existeProyecto) {
      const participantsSimple = await pool.query(
        "SELECT us.id_usuario,us.nombre,us.apellido,us.rol FROM public.participantes_proyectos as pro, public.usuarios as us where pro.id_usuario=us.id_usuario and pro.id_proyecto=$1",
        [id]
      );
      return participantsSimple;
    }
    return existeProyecto;
  }
  async get_categorias_proyectos(categoria) {
<<<<<<< HEAD
    const categorias = await pool.query(
      "SELECT proyectos.*, tipo as categoria FROM public.proyectos INNER JOIN public.categoria_proyectos ON proyectos.categoria_id = categoria_proyectos.id WHERE categoria_proyectos.tipo = $1 and estado=true",
      [categoria]
    );
    return categorias;
=======
      const categorias = await pool.query(
        "SELECT proyectos.* FROM public.proyectos INNER JOIN public.categoria_proyectos ON proyectos.categoria_id = categoria_proyectos.id WHERE categoria_proyectos.tipo = $1",
        [categoria]
      );
      return categorias;
>>>>>>> c54c3db... refactorizando endPoint get:categorias_proyectos
  }
  async get_categorias() {
    const categorias = await pool.query(
      "SELECT * FROM public.categoria_proyectos"
    );
    return categorias;
  }
  async cancel_participate_proyecto(id, id_autenticacion) {
    const res1 = Boolean(
      (
        await pool.query(
          "SELECT EXISTS(select id_usuario from participantes_proyectos where id_usuario=$1)",
          [id_autenticacion]
        )
      ).rows[0]["exists"]
    );
    const res = Boolean(
      (
        await pool.query(
          "SELECT EXISTS(select id_proyecto from participantes_proyectos where id_proyecto=$1)",
          [id]
        )
      ).rows[0]["exists"]
    );
    if (res && res1) {
      const cancel_participate_proyecto = await pool.query(
        "DELETE FROM public.participantes_proyectos WHERE id_usuario=$1 and id_proyecto=$2",
        [id_autenticacion, id]
      );
      const decrementar_participantes = await pool.query(
        "UPDATE proyectos SET numero_participantes=numero_participantes-1 WHERE id=$1",
        [id]
      );
    }
    return res && res1;
  }

  async get_my_proyectos(id_autenticacion) {
    const existe_usuario = Boolean(
      (
        await pool.query(
          "SELECT EXISTS(select id_usuario from participantes_proyectos where id_usuario=$1)",
          [id_autenticacion]
        )
      ).rows[0]["exists"]
    );
    if (existe_usuario) {
      const my_proyectos = await pool.query(
        "select p.*, tipo as categoria from proyectos as p INNER JOIN categoria_proyectos ON p.categoria_id = categoria_proyectos.id  where exists (select par.id_proyecto from participantes_proyectos par where par.id_usuario=$1 and p.id = par.id_proyecto) ",
        [id_autenticacion]
      );
      return my_proyectos;
    }
    return existe_usuario;
  }

  async get_lideres() {
    const lideres = await pool.query(
      "SELECT nombre FROM public.usuarios WHERE estado_de_disponibilidad='disponible' and estado_de_cuenta='activa' and rol='lider'"
    );
    return lideres;
  }

  async get_roles() {
    const roles = await pool.query(
      "SELECT DISTINCT rol FROM public.usuarios WHERE estado_de_disponibilidad='disponible' and estado_de_cuenta='activa'"
    );
    return roles;
  }

  async get_rol(id_autenticacion) {
    const rol = await pool.query(
      "SELECT rol FROM public.usuarios WHERE id_usuario = $1",
      [id_autenticacion]
    );
    return rol;
  }

  async get_numero_participantes(id_proyecto) {
    const numero_participantes_proyecto = await pool.query(
      "select count(id_usuario) from public.participantes_proyectos WHERE id_proyecto=$1",
      [id_proyecto]
    );
    const res = numero_participantes_proyecto.rows[0];

    return res;
  }
  async get_eventos_proyecto(id_proyecto) {
    const eventos = await pool.query(
      "SELECT * FROM public.eventos WHERE id_proyecto=$1",
      [id_proyecto]
    );

    return eventos;
  }

  async get_proyectos_acabado() {
    const proyectos_acabados = await pool.query(
      //************* */     'ACABADO' = false
      "SELECT * FROM public.proyectos WHERE estado=false"
    );
    return proyectos_acabados;
  }

  async participate_past_proyecto(id_proyecto, id_autenticacion, id_usuario) {
    const proyecto_existence = Boolean(
      (
        await pool.query(
          //************* */     'ACABADO' = false
          "SELECT EXISTS (SELECT * from proyectos where id=$1 and estado=false)",
          [id_proyecto]
        )
      ).rows[0]["exists"]
    );
    const core_team_existence = Boolean(
      (
        await pool.query(
          "SELECT EXISTS (SELECT * from usuarios where id_usuario=$1 and rol='core team')",
          [id_autenticacion]
        )
      ).rows[0]["exists"]
    );
    const usuario_existence = Boolean(
      (
        await pool.query(
          "SELECT EXISTS (SELECT * from usuarios where id_usuario=$1)",
          [id_usuario]
        )
      ).rows[0]["exists"]
    );
    const usuario_participate = Boolean(
      (
        await pool.query(
          "SELECT EXISTS(select * from participantes_proyectos where id_usuario=$1 and id_proyecto=$2)",
          [id_usuario, id_proyecto]
        )
      ).rows[0]["exists"]
    );
    if (
      proyecto_existence == true &&
      core_team_existence == true &&
      usuario_existence == true &&
      usuario_participate == false
    ) {
      const participate_proyecto = await pool.query(
        "INSERT INTO participantes_proyectos(id_usuario, id_proyecto)VALUES($1,$2)",
        [id_usuario, id_proyecto]
      );
      const incrementar_participantes = await pool.query(
        "UPDATE proyectos SET numero_participantes=numero_participantes+1 WHERE id=$1",
        [id_proyecto]
      );
    }
    return (
      proyecto_existence == true &&
      core_team_existence == true &&
      usuario_existence == true &&
      usuario_participate == false
    );
  }

  async get_usuarios() {
    const usuarios = await pool.query("SELECT id_usuario,(nombre ||' '|| apellido)as nombre_completo,telefono FROM public.usuarios");
    return usuarios;
  }


}

module.exports = DbProyectoRepositorio;