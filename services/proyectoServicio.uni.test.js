const res = require("express/lib/response");
const { rows } = require("pg/lib/defaults");
const ProyectoServicio = require("./proyectoServicio");

describe('testing all services point of proyectos',()=>{
    let _proyectoService;
    let mockRepository={
        get_proyectos:()=>{},
        get_proyecto:()=>{}
    } 
    beforeAll(()=>{
        _proyectoService=new ProyectoServicio(mockRepository)
    })  

    beforeEach(()=>{
        jest.resetAllMocks();
    });

    it('Should check if the events services was created',()=>{
        expect(_proyectoService).toBeTruthy()
    });

    it('Should check if tittle of proyecto is correct and return true',()=>{
        const data={titulo:"Agua potable"}
        const response=_proyectoService.validar(data)
        expect(response).toBe(true)
    });

    it('Should check if tittle of proyecto is not validate and return error',()=>{
        const data={titulo:""}
        const errorMessage=new Error("Por favor ingrese el nombre del proyecto.");
        try {
            _proyectoService.validar(data)
        } catch (error) {
            expect(error).toEqual(errorMessage)
        }
    });

    it('Should convert one date and return in other',()=>{
        const data = new Date(Date.UTC(2022, 10, 5, 3, 0, 0));
        const response=_proyectoService.convertir_fecha(data)
        expect(response).toBe("04/11/2022")
    });

    it('should check proyects don´t have any field in empty ',()=>{
        const data={titulo:"Agua es oro",descripcion:"El agua es un recurso indispensable",
        objetivo:"Informar",lider:"Israel",numero_participantes:"2",fecha_inicio:"13/05/22",
        fecha_fin:"05/08/22", categoria_id:"Medio Ambiente",estado:"En proceso",
        visualizar:"yes",informacion_adicional:"", url_imagen:"www.StartArmericasTogheter.com/proyect"}
        const response=_proyectoService.sin_nulls(data)
        expect(response).toEqual(data)
    })

    it('should check `titulo` isn`t empty and return the list of proyect',()=>{
        const data={titulo:"Empty"}
        const response=_proyectoService.sin_nulls(data)
        expect(response).toEqual(data)
    });

    it('should check `titulo` is empty return the list of proyect with titulo ',()=>{
        const data={titulo:null}
        const answer={titulo:""}
        const response=_proyectoService.sin_nulls(data)
        expect(response.titulo).toEqual(answer.titulo)
    });

    it('should check descripcion isn`t empty and return the list of proyect',()=>{
        const data={descripcion:"Empty"}
        const response=_proyectoService.sin_nulls(data)
        expect(response).toEqual(data)
    });

    it('should check descripcion is empty return the list of proyect with descripcion ',()=>{
        const data={descripcion:null}
        const answer={descripcion:""}
        const response=_proyectoService.sin_nulls(data)
        expect(response.descripcion).toEqual(answer.descripcion)
    });

    it('should check objetivo isn`t empty and return the list of proyect',()=>{
        const data={objetivo:"Empty"}
        const response=_proyectoService.sin_nulls(data)
        expect(response).toEqual(data)
    });

    it('should check objetivo is empty return the list of proyect with objetivo ',()=>{
        const data={objetivo:null}
        const answer={objetivo:""}
        const response=_proyectoService.sin_nulls(data)
        expect(response.objetivo).toEqual(answer.objetivo)
    });

    it('should check lider isn`t empty and return the list of proyect',()=>{
        const data={objetivo:"Empty"}
        const response=_proyectoService.sin_nulls(data)
        expect(response).toEqual(data)
    });

    it('should check lider is empty return the list of proyect with lider ',()=>{
        const data={objetivo:null}
        const answer={objetivo:""}
        const response=_proyectoService.sin_nulls(data)
        expect(response.objetivo).toEqual(answer.objetivo)
    });

    it('should check numero_participantes isn`t empty and return the list of proyect',()=>{
        const data={numero_participantes:"Empty"}
        const response=_proyectoService.sin_nulls(data)
        expect(response).toEqual(data)
    });

    it('should check numero_participantes is empty return the list of proyect with numero_participantes ',()=>{
        const data={numero_participantes:null}
        const answer={numero_participantes:""}
        const response=_proyectoService.sin_nulls(data)
        expect(response.numero_participantes).toEqual(answer.numero_participantes)
    });

    it('should check fecha_inicio isn`t empty and return the list of proyect',()=>{
        const data={fecha_inicio:"Empty"}
        const response=_proyectoService.sin_nulls(data)
        expect(response).toEqual(data)
    });

    it('should check fecha_inicio is empty return the list of proyect with fecha_inicio ',()=>{
        const data={fecha_inicio:null}
        const answer={fecha_inicio:""}
        const response=_proyectoService.sin_nulls(data)
        expect(response.fecha_inicio).toEqual(answer.fecha_inicio)
    });

    it('should check fecha_fin isn`t empty and return the list of proyect',()=>{
        const data={fecha_fin:"Empty"}
        const response=_proyectoService.sin_nulls(data)
        expect(response).toEqual(data)
    });

    it('should check fecha_fin is empty return the list of proyect with fecha_fin ',()=>{
        const data={fecha_fin:null}
        const answer={fecha_fin:""}
        const response=_proyectoService.sin_nulls(data)
        expect(response.fecha_fin).toEqual(answer.fecha_fin)
    });

    it('should check categoria_id isn`t empty and return the list of proyect',()=>{
        const data={categoria_id:"Empty"}
        const response=_proyectoService.sin_nulls(data)
        expect(response).toEqual(data)
    });

    it('should check categoria_id is empty return the list of proyect with categoria_id ',()=>{
        const data={categoria_id:null}
        const answer={categoria_id:""}
        const response=_proyectoService.sin_nulls(data)
        expect(response.categoria_id).toEqual(answer.categoria_id)
    });

    it('should check estado isn`t empty and return the list of proyect',()=>{
        const data={estado:"Empty"}
        const response=_proyectoService.sin_nulls(data)
        expect(response).toEqual(data)
    });

    it('should check estado is empty return the list of proyect with estado ',()=>{
        const data={estado:null}
        const answer={estado:""}
        const response=_proyectoService.sin_nulls(data)
        expect(response.estado).toEqual(answer.estado)
    });

    it('should check visualizar isn`t empty and return the list of proyect',()=>{
        const data={visualizar:"Empty"}
        const response=_proyectoService.sin_nulls(data)
        expect(response).toEqual(data)
    });

    it('should check visualizar is empty return the list of proyect with visualizar ',()=>{
        const data={visualizar:null}
        const answer={visualizar:""}
        const response=_proyectoService.sin_nulls(data)
        expect(response.visualizar).toEqual(answer.visualizar)
    });

    it('should check informacion_adicional isn`t empty and return the list of proyect',()=>{
        const data={informacion_adicional:"Empty"}
        const response=_proyectoService.sin_nulls(data)
        expect(response).toEqual(data)
    });

    it('should check informacion_adicional is empty return the list of proyect with informacion_adicional ',()=>{
        const data={informacion_adicional:null}
        const answer={informacion_adicional:""}
        const response=_proyectoService.sin_nulls(data)
        expect(response.informacion_adicional).toEqual(answer.informacion_adicional)
    });

    it('should check url_imagen isn`t empty and return the list of proyect',()=>{
        const data={url_imagen:"Empty"}
        const response=_proyectoService.sin_nulls(data)
        expect(response).toEqual(data)
    });

    it('should check url_imagen is empty return the list of proyect with url_imagen ',()=>{
        const data={url_imagen:null}
        const answer={url_imagen:""}
        const response=_proyectoService.sin_nulls(data)
        expect(response.url_imagen).toEqual(answer.url_imagen)
    });

    it('Should return all proyects when this is success',async()=>{
        const data=true
        const spyGetProyectos=jest.spyOn(mockRepository,'get_proyectos').mockReturnValue(true)
        const response=await _proyectoService.get_proyectos(data)
        expect(spyGetProyectos).toHaveBeenCalled()
        expect(response).toEqual(data)
    })

    it('Should return any proyects when this is fail',async()=>{
        const data=new Error("No se pudo obtener")
        const spyGetProyectos=jest.spyOn(mockRepository,'get_proyectos').mockImplementation(async (error) => Promise.reject(error));
        const response=await _proyectoService.get_proyectos(data).catch(e=>e)
        expect(spyGetProyectos).toHaveBeenCalled()
        expect(response).toEqual(data)
    })

    it('Should return one proyect when this is success',async ()=>{
        const data={rows:[{id:1,titulo:"Agua es oro"},{id:2,titulo:"Agua es plata"}]}
        const spyGetProyecto=jest.spyOn(mockRepository,'get_proyecto').mockImplementation((data)=>{return data})
        const response=await _proyectoService.get_proyecto(data)
        expect(spyGetProyecto).toHaveBeenCalled()
        expect(response).toBe(data)
    });

    it('Should return one proyect when this is success',async ()=>{
        const data={rows:[]}
        const errorMessage="No se hallo ningun proyecto con ese id.";
        const spyGetProyecto=jest.spyOn(mockRepository,'get_proyecto').mockImplementation((data)=>{return data})
        const response=await _proyectoService.get_proyecto(data).catch(e=>e)
        expect(spyGetProyecto).toHaveBeenCalled()
        expect(response.message).toBe(errorMessage)
    });
    
});