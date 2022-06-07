const { response } = require("express");
const EventoServicio = require("./eventoServicio");

describe('Testing all services events',()=>{
    let eventService;
    let mockRepository={
        events:[],
        categories:[],
        createEvent:(data)=>{ mockRepository.events.push(data);return true},
        getEvents:(data)=>{data;return mockRepository.events},
        getCategories:(data)=>{data;return mockRepository.categories },
        getParticipantsEvents:(idEvent)=>{return (mockRepository.events.filter((event)=>{ return event.id==idEvent}))[0].participantes},
        getEvent:(idEvent)=>{return mockRepository.events.filter((event)=>{ return event.id==idEvent??event  })},
        deleteEvent:(dataEvent)=>{return mockRepository.events.filter((event)=>{return event.id!=dataEvent.id??event })},
        deleteParticipation:(idEvent, idUser)=>{return true},
        getEventsUser:(data)=>{return true},
        updateStateEvent1:()=>{return true},
        updateStateEvent2:()=>{return true},
        updateEvent:(data,id)=>{return true},
        participateEvent:(idUser,idEvent)=>{ return idUser==idEvent},
        getLeaders:(data)=>{return data.lider},
        getMyEvents:(data)=>{return {rows:data.eventos}}
    }
    beforeAll(()=>{
        eventService=new EventoServicio(mockRepository);
        let categories=["Animales","Comunidad","Trabajo Social","Educación"];
        let userOne={id:1,nombre:"Connor",LastName:"McGregor"};
        let userTwo={id:2,nombre:"Leprechaun",LastName:"Irish"};
        let liderOne={id:1,nombre:userOne.nombre,categoria:"Lider"}
        let firstEvent={id:1,nombre_evento:"Fundación",lider:liderOne.nombre,fechaInicio:"17/25/23",fechaFin:"18/09/25",participantes:[userTwo,userOne]};
        let secondEvent={id:2,nombre_evento:"Recaudacion",lider:liderOne.nombre,fechaInicio:"17/25/23",fechaFin:"18/09/25",participantes:[userOne]};
        mockRepository.createEvent(firstEvent);
        mockRepository.createEvent(secondEvent);
        mockRepository.categories=categories;
    });

    beforeEach(()=>{
        jest.resetAllMocks();
    });

    it('Should check if the events services was created',()=>{
        expect(eventService).toBeTruthy()
    });

    it('Should return false when validar function is called with empty nombre_evento',()=>{
        const data = {
            nombre_evento: "Visita a Champarrancho"
        };
        const isValid=eventService.validar(data)
        expect(isValid).toBe(true)
    })
    
    it('should return true when validar function is called with non-empty nombre_evento',() => {
        const data = {
            nombre_evento: ""
        };
        try{
            eventService.validar(data)
        }
        catch(error){
            expect(error).toBe("Por favor ingrese un nombre del evento")
        }
    })

    it('Should return all events when this is success',async ()=>{
        const countEventos=2;
        const spyGetEvent=jest.spyOn(mockRepository,'getEvents')
        const response=await eventService.get_eventos("")
        expect(spyGetEvent).toHaveBeenCalled()
        expect(response).toHaveLength(countEventos)
    })

    it('Should return all events when this is success',async ()=>{
        data={}
        const spyGetEvent=jest.spyOn(mockRepository,'getEventsUser')
        const response=await eventService.get_eventos_usuario(data)
        expect(spyGetEvent).toHaveBeenCalled()
        expect(response).toEqual(true)
    })
    
    it('Should return any events when this is fail',async ()=>{
        let errorMessage="No se puedo obtener el evento21"
        const spyGetEventError=jest.spyOn(mockRepository,'getEvents').mockReturnValue( ()=>{throw new Error(errorMessage)})
        const response= await eventService.get_eventos("");
        expect(spyGetEventError).toHaveBeenCalled()
        expect(response).toThrowError(errorMessage)
    })

    it('Should return all categories of events when this success',async ()=>{
        data={}
        const count_categories=4;
        const spyGetCategorias=jest.spyOn(mockRepository,'getCategories')
        const response=await eventService.get_categorias(data);
        expect(spyGetCategorias).toHaveBeenCalled()
        expect(response).toHaveLength(count_categories)
    });

    it('Should get one event of events by id when this success',async()=>{
        let data={req:{rows:{id:2}}}
        const spyGetEvento=jest.spyOn(mockRepository,'getEvent')
        const response=await eventService.get_evento(data.req.rows.id);
        expect(spyGetEvento).toHaveBeenCalled()
        expect(response[0].id).toBe(data.req.rows.id)
    });

    it('Should delete one event of events by id when this success ',async ()=>{
        let data={id:2,nombre_evento:"algo"}
        const spyDeleteEvent= jest.spyOn(mockRepository,'deleteEvent')
        const response=await eventService.delete_evento(data);
        expect(spyDeleteEvent).toHaveBeenCalled()
        expect(response).toHaveLength(1)
    });

    it.skip('Should return Error when this fail ',async ()=>{
        let data={id:2,nombre_evento:""}
        const errorMessage=new Error("Algo inesperado paso con el repositorio");
        const response=await eventService.delete_evento(data);
        expect(response).toEqual(errorMessage)
    });
    
    it('should get all participants of one event when this success',async ()=>{
        let data={req:{rows:{id:1}}}
        const spyGetAllParticipants= jest.spyOn(mockRepository,'getParticipantsEvents')
        const response=await eventService.get_participantes_eventos(data.req.rows.id);
        expect(spyGetAllParticipants).toHaveBeenCalledTimes(1)
        expect(response).toHaveLength(2)
    });

    it('Should create new event and return success message',async()=>{
        const data={id:3,nombre_evento:"Fundación",lider:"",fechaInicio:"17/25/23",fechaFin:"18/09/25",participantes:[]};
        const spyCreateEvent= jest.spyOn(mockRepository,'createEvent')
        const response=await eventService.create_evento(data);
        expect(spyCreateEvent).toHaveBeenCalledTimes(1)
        expect(response).toEqual(true)
    });

    it.skip('Should not create new event and return fail message',async()=>{
        const errorMessage=new Error("Algo inesperado paso con el repositorio")
        const data={id:3,nombre_evento:"",lider:"",fechaInicio:"17/25/23",fechaFin:"18/09/25",participantes:[]};
        const response=await eventService.create_evento(data);
        expect(response).toEqual(errorMessage)
    });

    it('Should update one event and return success message',async()=>{
        const data={id:3,nombre_evento:"Fundación",lider:"",fechaInicio:"17/25/23",fechaFin:"18/09/25",participantes:[]};
        const spyUpdateEvent= jest.spyOn(mockRepository,'updateStateEvent1')
        const response=await eventService.update_evento_estado1(data);
        expect(spyUpdateEvent).toHaveBeenCalledTimes(1)
        expect(response).toEqual(true)
    });

    it.skip('Should not update one event and return fail message',async()=>{
        const error=new Error("Algo inesperado paso con el repositorio");
        const data={id:3,nombre_evento:"",lider:"",fechaInicio:"17/25/23",fechaFin:"18/09/25",participantes:[]};
        const response=await eventService.updateStateEvent1(data);
        expect(response).toEqual(error)
    });

    it('Should delete one participant and return success message',async()=>{
        const data={id:3,nombre_evento:"Fundación",lider:"",fechaInicio:"17/25/23",fechaFin:"18/09/25",participantes:[]};
        const spyDeleteParticipant= jest.spyOn(mockRepository,'deleteParticipation')
        const response=await eventService.eliminar_participacion(data.id,data.id);
        expect(spyDeleteParticipant).toHaveBeenCalledTimes(1)
        expect(response).toEqual(true)
    });

    it.skip('Should not delete one participant and return fail message',async()=>{
        const error=new Error("Algo inesperado paso con el repositorio");
        const data={id:3,nombre_evento:"",lider:"",fechaInicio:"17/25/23",fechaFin:"18/09/25",participantes:[]};
        const response=await eventService.eliminar_participacion(data.id,data.id);
        expect(response).toEqual(error)
    });

    it('Should update one event and return success message',async()=>{
        const data={id:3,nombre_evento:"Fundación",lider:"",fechaInicio:"17/25/23",fechaFin:"18/09/25",participantes:[]};
        const spyUpdateEvent1= jest.spyOn(mockRepository,'updateStateEvent2')
        const response=await eventService.update_evento_estado2(data);
        expect(spyUpdateEvent1).toHaveBeenCalledTimes(1)
        expect(response).toEqual(true)
    });

    it.skip('Should not update one event and return error message',async()=>{
        const error=new Error("Algo inesperado paso con el repositorio");
        const data={id:3,nombre_evento:"",lider:"",fechaInicio:"17/25/23",fechaFin:"18/09/25",participantes:[]};
        const response=await eventService.update_evento_estado2(data);
        expect(response).toEqual(error)
    });

    it('Should update one event and return success message',async()=>{
        const data={id:3,nombre_evento:"Fundación",lider:"",fechaInicio:"17/25/23",fechaFin:"18/09/25",participantes:[]};
        const spyUpdateEvent1= jest.spyOn(mockRepository,'updateEvent')
        const response=await eventService.actualizar_evento(data,data.id);
        expect(spyUpdateEvent1).toHaveBeenCalledTimes(1)
        expect(response).toEqual(true)
    });

    it.skip('Should not update one event and return error message',async()=>{
        const error=new Error("Error al actualizar evento!");
        const data={id:3,nombre_evento:"",lider:"",fechaInicio:"17/25/23",fechaFin:"18/09/25",participantes:[]};
        const response=await eventService.actualizar_evento(data,data.id).catch((error)=>{return error});
        expect(response).toEqual(error)
    });

    it('Should add participant on one event and return success message',async ()=>{
        const user={id:3}
        const data={id:3,nombre_evento:"Fundación",lider:"",fechaInicio:"17/25/23",fechaFin:"18/09/25",participantes:[]};
        const spyParticipate= jest.spyOn(mockRepository,'participateEvent')
        const response=await eventService.participate_evento(user.id,data.id);
        expect(spyParticipate).toHaveBeenCalledTimes(1)
        expect(response).toEqual(true)
    });

    it.skip('Should not add participant on one event and return fail message',async ()=>{
        const user={id:1}
        const data={id:3,nombre_evento:"Fundación",lider:"",fechaInicio:"17/25/23",fechaFin:"18/09/25",participantes:[]};
        const errorMessage="El 1 del evento no existe."
        const spyParticipate= jest.spyOn(mockRepository,'participateEvent').mockImplementation(()=>Promise.reject(new Error()))
        const response=await eventService.participate_evento(user.id,data.id).catch((error)=>{return error})
        expect(spyParticipate).toHaveBeenCalledTimes(1)
        expect(response.message).toEqual(errorMessage)
    });

    it('Should return all leaders on one event and return success message',async ()=>{ 
        const user={id:3,name:"Connor"}
        const data={id:3,nombre_evento:"Fundación",lider:user.name,fechaInicio:"17/25/23",fechaFin:"18/09/25",participantes:[]};
        const spyLeaders= jest.spyOn(mockRepository,'getLeaders')
        const response=await eventService.get_lideres(data)
        expect(spyLeaders).toHaveBeenCalledTimes(1)
        expect(response).toEqual(data.lider)
    });

    it('Should not return all leaders on one event and return fail message',async ()=>{
        const data={id:3,nombre_evento:"Fundación",lider:"",fechaInicio:"17/25/23",fechaFin:"18/09/25",participantes:[]};
        const errorMessage="No existe ningun lider"
        const spyLeaders= jest.spyOn(mockRepository,'getLeaders').mockImplementation(()=>Promise.reject(new Error(errorMessage)))
        const response=await eventService.get_lideres(data).catch((error)=>{return error})
        expect(spyLeaders).toHaveBeenCalledTimes(1)
        expect(response.message).toEqual(errorMessage)
    });

    it('Should return all events on one participant and return success message',async ()=>{ 
        const data={id:3,name:"Connor",eventos:[{id:1, evento:"a",fecha_evento:"13/12/22",hora_inicio:"17:15"},{id:2,evento:"b",fecha_evento:"17/12/22",hora_inicio:"07:15"},{id:3,evento:"c",fecha_evento:"07/12/22",hora_inicio:"00:15"}]}
        const spyMyEventos= jest.spyOn(mockRepository,'getMyEvents')
        const response=await eventService.get_my_eventos(data)
        expect(spyMyEventos).toHaveBeenCalledTimes(1)
        expect(response).toEqual(data.eventos)
    });

    it.skip('Should not return events on one participant and return fail message',async ()=>{
        const data=""
        const errorMessage="Algo inesperado paso con la Base de datos o el id del participante no existe"
        const spyLeaders= jest.spyOn(mockRepository,'getMyEvents').mockImplementation(()=>Promise.reject(new Error()))
        const response=await eventService.get_my_eventos(data).catch((error)=>{return error})
        expect(spyLeaders).toHaveBeenCalledTimes(1)
        expect(response.message).toEqual(errorMessage)
    });
})