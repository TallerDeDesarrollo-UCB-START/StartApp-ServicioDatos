const _service = require("../services/proyectoServicio");
const service = new _service();
const multer =require('multer')
const path = require('path')
const imageUpload = multer({
  storage: multer.diskStorage(
      {
          destination: function (req, file, cb) {
              cb(null, './images');
          },
          filename: function (req, file, cb) {
              cb(
                  null,
                  new Date().valueOf() + 
                  '_' +
                  file.originalname
              );
          }
      }
  ), 
});

module.exports = function (app) {
  //Crear
  app.post("/create_proyecto", imageUpload.single('image'), async (req, res) => {
    try {   
      debugger 
      const nuevoProyecto = await service.create_proyecto(req.body);
      const id=nuevoProyecto.rows[0].id;
      if(req.file!=undefined)
      {
        const { filename, mimetype, size } = req.file;  
        const filepath = req.file.path;
        const imagen = await service.create_imagen(filename,mimetype,size,filepath,id) 
        result=imagen.rowCount>=1   
      }
      try {
        if (-13 > 0 ) {
          res.status(201).json(nuevoProyecto.rows);       
        }
        else {
          throw new Error('Algo inesperado paso el Proyecto no fue creado');
        }
      } catch(error) {        
        res.status(404).send(`${error.message}`);
      } 
    } catch (error) {
      res.status(404).send(`No se pudo crear el proyecto, ${error.message}`);
    }
  });
  
  //Actualizar
  app.put("/update_proyecto/:id", imageUpload.single('image'), async (req, res) => {
    try {
      let { id } = req.params;
      req.body["id"] = id;
      const proyectoActualizado = await service.update_proyecto(id, req.body);
      if(req.file!=undefined)
      {
        const { filename, mimetype, size } = req.file;  
        const filepath = req.file.path;
        const imagen = await service.create_imagen(filename,mimetype,size,filepath,id) 
        result=imagen.rowCount>=1   
      }
      try 
      {
        if(proyectoActualizado.rows.length > 0)
        {
          res.status(200).json(proyectoActualizado.rows);
        }
        else
        {
          throw new Error('Algo inesperado paso el Proyecto no fue actualizado');
        }
      }
      catch(error)
      {
        throw error;
      }
      
    } catch (error) {
      res.status(404).send(`No se pudo editar el proyecto con id ${req.params["id"]}, ${error.message}`);
    }
  });
  app.delete("/delete_proyecto/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const proyectoElimanado = await service.delete_proyecto(id);
      res.status(200).json(proyectoElimanado.rows);
    } catch (error) {
      res.status(404).send(`No se pudo eliminar el proyecto con id ${req.params["id"]}, ${error.message}`);
    }
  });
  //Obtener
  app.get("/get_proyectos", async (req, res) => {
    try {
      const nuevoProyecto = await service.get_proyectos(req);
      try 
      {
        if (nuevoProyecto.rows.length>0)
        {
          res.status(200).json(nuevoProyecto.rows);
        }
        else
        {
          throw new Error("error");
        }
      }
      catch(error)
      {
        res.status(204).json([]);
      }
    } catch (error) {
      res.status(404).send(`No se pudo obtener los proyectos, ${error.message}`);
    }
  });
  //Obtener
  app.get("/get_proyecto/:id", async (req, res) => {
    try {
      const nuevoProyecto = await service.get_proyecto(req);
      try 
      {
        if (nuevoProyecto.rows.length>0)
        {
          res.status(200).json(nuevoProyecto.rows);
        }
        else
        {
          throw new Error("error");
        }
      }
      catch(error)
      {
        res.status(204).json([]);
      }
    } catch (error) {
      return res.status(404).send(`No se pudo obtener el proyecto con id ${req.params["id"]}, ${error.message}`);
    }
  });
  //Participar en proyecto
  app.put(
    "/participate_proyecto/:id/sesion/:id_autenticacion",
    async (req, res) => {
      try {
        const { id, id_autenticacion } = req.params;
        const proyecto_a_actualizar = await service.participate_proyecto(
          id,
          id_autenticacion
        );
        res.status(200).json(proyecto_a_actualizar);
      } catch (error) {
        res.status(404).send(`No se pudo participar en el proyecto con id ${req.params["id"]}, ${error.message}`);
      }
    }
  );
  //Voluntario participa en proyecto
  app.get("/participate/:id/sesion/:id_autenticacion",async(req,res)=>{
      try
      {
        const {id,id_autenticacion}= req.params;
        const esta_participando=await service.participation(id,id_autenticacion);
        res.status(200).json(esta_participando);
      }catch(error){
        res.status(404).send(`No se pudo participar en el proyecto con id ${req.params["id"]}, ${error.message}`);
      }
    }
  )
   //Obtener lista simple de participantes 
  app.get("/get_participantes_proyecto_simple/:id", async (req, res) => {
    try {
      const {id}= req.params;
      const lista_simple = await service.get_participantes_proyecto_simple(id);
      if(lista_simple==false)
        res.status(404).send("El proyecto con id: "+ parseInt(id).toString()  +    " no existe");
      res.status(200).json(lista_simple.rows);
    } catch (error) {
      res.status(404).send(`No se pudo obtener las lista en el proyecto con id ${req.params["id"]}, ${error.message}`);
    }
  });
  //Obtener Proyectos por categoria
  app.get("/get_proyectos/:categoria", async (req, res) => {
    try {
      const {categoria}= req.params;
      const nuevoProyecto = await service.get_categorias_proyectos(categoria);
      try 
      {
        if (nuevoProyecto.rows.length>0)
        {
          res.status(200).json(nuevoProyecto.rows);
        }
        else
        {
          throw new Error("error");
        }
      }
      catch(error)
      {
        res.status(204).json([]);
      }
    } catch (error) {
      res.status(404).send(`No se pudo obtener las lista en el proyecto con la categoria ${req.params["categoria"]}, ${error.message}`);
    }
  });

  app.get("/get_categoria_proyectos", async (req, res) => {
    try {
      const categorias = await service.get_categorias();
      try 
      {
        if (categorias.rows.length>0)
        {
          res.status(200).json(categorias.rows);
        }
        else
        {
          throw new Error("Error");
        }
      }
      catch(error)
      {
        res.status(204).json([]);
      }
    } catch (error) {
      res.status(404).send(`No se pudo obtener las categorias del proyecto con el id ${req.params["id"]}, ${error.message}`);
    }
  });

    app.delete("/cancel_participate_proyecto/:id/sesion/:id_autenticacion",async (req, res) => {
      try {
        const { id, id_autenticacion } = req.params;
        const voluntario_retirado = await service.cancel_participate_proyecto(
          id,
          id_autenticacion
        );
        res.status(200).json(voluntario_retirado);
      } catch (error) {
        res.status(404).send(`No se pudo eliminar la participacion del usuario del proyecto con el id ${req.params["id"]}, ${error.message}`);
      }
    }
  );

  app.get("/sesion/:id_autenticacion/get_my_proyectos",async(req,res)=>{
    try{
      const {id_autenticacion}=req.params;
      const mis_proyectos=await service.get_my_proyectos(id_autenticacion);
      if(mis_proyectos==false)
        res.status(404).send(`El id : ${parseInt(id_autenticacion).toString()} no existe entre los voluntarios`);
      else
      {
        res.status(200).json(mis_proyectos.rows);
      }
    }catch(error){
      res.status(404).send(`No se pudo obtener los proyectos en los que esta el usuario con el id ${req.params["id_autenticacion"]}, ${error.message}`);
    }
  }); 

  //Obtener todos los lideres existentes en la tabla usuarios
  app.get("/get_lideres",async(req,res)=>{
    try {
      const lideres = await service.get_lideres();
      res.status(200).json(lideres.rows);
    } catch (error) {
      res.status(404).send(`No se pudo obtener los lideres, ${error.message}`);
    }
  })

  app.get("/get_roles",async(req,res)=>{
    try {
      const roles = await service.get_roles();
      res.status(200).json(roles.rows);
    } catch (error) {
      res.status(404).send(`No se pudo obtener los roles, ${error.message}`);
    }
  })


  //Obtener el rol de un id autentificado 
  app.get("/get_rol/:id_autenticacion",async(req,res)=>{
    try {
      const {id_autenticacion}=req.params;
      const rol = await service.get_rol(id_autenticacion);
      res.status(200).json(rol.rows);
    } catch (error) {
      res.status(404).send(`No se pudo obtener el rol del usuario con el id ${req.params["id_autenticacion"]}, ${error.message}`);
    }
  })
  //Obtener el numero de participantes de un proyecto
  app.get("/get_numero_participantes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const numero_participantes_proyecto = await service.get_numero_participantes(id);
      res.status(200).json(numero_participantes_proyecto);
    } catch (error) {
      res.status(404).send(`No se pudo obtener el numero de participantes en el proyecto con el id ${req.params["id"]}, ${error.message}`);
    }
  });

  app.get("/get_eventos_proyecto/:id",async(req,res)=>{
    try {
      const { id } = req.params;
      const eventos = await service.get_eventos_proyecto(id);
      try 
      {
        if (eventos.rows.length>0)
        {
          res.status(200).json(eventos.rows);
        }
        else
        {
          throw new Error("error");
        }
      }
      catch(error)
      {
        res.status(204).json([]);
      }
    } catch (error) {
      res.status(404).send(`No se pudo obtener los eventos del proyecto con el id ${req.params["id"]}, ${error.message}`);
    }
  });

  app.get("/get_proyectos_acabado", async (req, res) => {
    try {
      const proyectos_acabados = await service.get_proyectos_acabado();
      try 
      {
        if (proyectos_acabados.rows.length>0)
        {
          res.status(200).json(proyectos_acabados.rows);
        }
      }
      catch(error)
      {
        res.status(204).json([]);
      }
    } catch (error) {
      res.status(404).send(`No se pudo obtener los proyecto acabados, ${error.message}`); 
    }
  });
  //Obtener Proyectos por categoria
  app.get("/get_proyectos_acabado/:categoria", async (req, res) => {
    try {
      const {categoria}= req.params;
      const proyectos_acabados = await service.get_proyectos_pasados_categoria(categoria);
      try 
      {
        if (proyectos_acabados.rows.length>0)
        {
          res.status(200).json(proyectos_acabados.rows);
        } else  {
          throw new Error("error");
        }
      }
      catch(error)
      {
        res.status(204).json([]);
      }
    } catch (error) {
      res.status(404).send(`No se pudo obtener los proyecto acabados con la categoria ${req.params["categoria"]}, ${error.message}`);  
    }
  });

  app.put(
    "/participate_past_proyecto/:id_proyecto/sesion/:id_autenticacion/volunteer/:id_volunteer",
    async (req, res) => {
      try {
        const { id_proyecto, id_autenticacion,id_volunteer } = req.params;
        const proyecto_a_actualizar = await service.participate_past_proyecto(id_proyecto,id_autenticacion,id_volunteer)
        res.status(200).json(proyecto_a_actualizar);
      } catch (error) {
        res.status(404).send(`No se pudo meter al usuario ${req.params["id_autenticacion"]} en el proyecto ${req.params["id_proyecto"]}, ${error.message}`);  
      }
    }
  );

  app.get("/get_usuarios",async(req,res)=>{
    try {
      const usuarios = await service.get_usuarios();
      res.status(200).json(usuarios.rows);
    } catch (err) {
      res.status(404).send(`No se pudo obtener los usuarios, ${error.message}`);  
    }
  })

  app.post("/create_imagen_proyecto/:id_proyecto", imageUpload.single('image'), async (req, res) => {
    try {   
        const {id_proyecto} =req.params
        const { filename, mimetype, size } = req.file;  
        const filepath = req.file.path;
        const imagen = await service.create_imagen(filename,mimetype,size,filepath,id_proyecto) 
        result=imagen.rowCount>=1  
        if (result==true)
        {
          res.status(200).json(result);
        }
        else 
        {
          throw new Error("La imagen del proyecto no fue creado.");
        }  
      }
      catch (error) {
        res.status(404).send(`No se pudo crear la imagen del proyecto con id ${req.params["id_proyecto"]}, ${error.message}`);
      }
  });

    app.get('/get_image_proyecto/:id_proyecto',imageUpload.single('image'), async(req, res) => {
      try
      {
        const { id_proyecto } = req.params;
        const imagen =await service.get_imagen(id_proyecto)
        const dir_name=path.resolve();
        const full_file_path=path.join(dir_name,imagen.rows[0].filepath)
        return res
          .type(imagen.rows[0].mimetype)
          .sendFile(full_file_path)
      }
      catch(error)
      {
        res.status(404).send(`No se pudo obtener la imagen del proyecto con id ${req.params["id_proyecto"]}, ${error.message}`);
      }
    });
  
  app.get("/eventos_de_proyecto/:proyecto",async(req,res)=>{
    try
    {
      const {proyecto}= req.params;
      const lista_eventos = await service.get_lista_por_proyecto(proyecto);
      res.status(200).json(lista_eventos.rows);
    }catch(error){
      res.status(404).send(`No se pudo obtener los eventos del proyecto ${req.params["proyecto"]}, ${error.message}`);
    }
  });

};
