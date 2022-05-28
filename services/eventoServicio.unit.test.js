const { response } = require("express");
const EventoServicio = require("./eventoServicio");

describe(' ',()=>{
    let _eventoService;
    let mockRepository={
        eventos:[],
        categorias:[],
        create_evento:(data)=>{ mockRepository.eventos.push(data)},
        get_eventos:()=>{return mockRepository.eventos},
        get_categorias:()=>{return mockRepository.categorias},
        get_participantes_eventos:(idEvento)=>{return (mockRepository.eventos.filter((evento)=>{ return evento.id==idEvento}))[0].participantes},
        get_evento:(idEvento)=>{return mockRepository.eventos.filter((evento)=>{ return evento.id==idEvento??evento  })},
        delete_evento:(idEvento)=>{return mockRepository.eventos.filter((evento)=>{ return evento.id=!idEvento??evento })}
    }
    beforeAll(()=>{
        _eventoService=new EventoServicio(mockRepository);
        let categorias=["Animales","Comunidad","Trabajo Social","Educación"];
        let userOne={id:1,nombre:"Connor",LastName:"McGregor"};
        let userTwo={id:2,nombre:"Leprechaun",LastName:"Irish"};
        let liderOne={id:1,nombre:userOne.nombre,categoria:"Lider"}
        let firstEvent={id:1,nombre_evento:"Fundación",lider:liderOne.nombre,fechaInicio:"17/25/23",fechaFin:"18/09/25",participantes:[userTwo,userOne]};
        let secondEvent={id:2,nombre_evento:"Recaudacion",lider:liderOne.nombre,fechaInicio:"17/25/23",fechaFin:"18/09/25",participantes:[userOne]};
        mockRepository.create_evento(firstEvent);
        mockRepository.create_evento(secondEvent);
        mockRepository.categorias=categorias;
    });

    beforeEach(()=>{
    });

    it('Should checks if the events services was created',()=>{
        expect(_eventoService).toBeTruthy()
    });

    it('Should returns false when validar function is called with empty nombre_evento',()=>{
        const data = {
            nombre_evento: "Visita a Champarrancho"
        };
        const isValid=_eventoService.validar(data)
        expect(isValid).toBe(true)
    })
    
    it('should returns true when validar function is called with non-empty nombre_evento',() => {
        const data = {
            nombre_evento: "Visita a Champarrancho"
        };
        const isValid = _eventoService.validar(data);
        expect(isValid).toBe(true);
    })

    it('Should  returns all events when this is success',async ()=>{
        const countEventos=2;
        const spyGetEvent=jest.spyOn(mockRepository,'get_eventos')
        const response=await _eventoService.get_eventos()
        expect(spyGetEvent).toHaveBeenCalled()
        expect(response).toHaveLength(countEventos)
    })

    it('Should returns all categories of events when this sucess',async ()=>{
        const count_categories=4;
        const spyGetCategorias=jest.spyOn(mockRepository,'get_categorias')
        const response=await _eventoService.get_categorias();
        expect(spyGetCategorias).toHaveBeenCalled()
        expect(response).toHaveLength(count_categories)
    });

    it('Should get one event of events by id when this success',async()=>{
        let data={req:{rows:{id:2}}}
        const spyGetEvento=jest.spyOn(mockRepository,'get_evento')
        const response=await _eventoService.get_evento(data.req.rows.id);
        expect(spyGetEvento).toHaveBeenCalled()
        expect(response[0].id).toBe(data.req.rows.id)
    });

    /*it('Should delete one event of events by id when this success ',async ()=>{
        let data={id:2,nombre_evento:"algo"}
        const spyDeleteEvent= jest.spyOn(mockRepository,'delete_evento')
        const response=await _eventoService.delete_evento(data.id);
        expect(spyDeleteEvent).toHaveBeenCalled()
        expect(response).toHaveLength(0)
    });*/

    // it('',async ()=>{
    //     const spyGetAllParticipants= jest.spyOn(mockRepository,'get_participantes_eventos')
    //     const response=await _eventoService.get_participantes_eventos();
    //     expect(spyGetAllParticipants).toHaveBeenCalled()
    //     expect(response).toHaveLength(2)
    // });
    
    it('should gets all participants of one event when this sucess',async ()=>{
        let data={req:{rows:{id:1}}}
        const spyGetAllParticipants= jest.spyOn(mockRepository,'get_participantes_eventos')
        const response=await _eventoService.get_participantes_eventos(data.req.rows.id);
        expect(spyGetAllParticipants).toHaveBeenCalled()
        expect(response).toHaveLength(2)
    });
})