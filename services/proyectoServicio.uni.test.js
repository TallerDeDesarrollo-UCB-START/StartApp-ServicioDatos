const ProyectoServicio = require("./proyectoServicio");

describe('testing all services point of proyectos',()=>{
    let _proyectoService;
    let mockRepository={
        get_proyectos:()=>{}
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
});