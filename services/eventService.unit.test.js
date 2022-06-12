const { response } = require("express");
const EventService = require("./eventService");

describe('Testing all services of event',()=>{
    let eventService;
    let mockRepository={
        events:[],
        categories:[],
        createEvent:(data)=>{ 
            mockRepository.events.push(data);return true
        },
        getEvents:(data)=>{
            data;return mockRepository.events
        },
        getCategories:(data)=>{
            data;return mockRepository.categories
        },
        getAllParticipantsForAnEvent:(idEvent)=>{
            return (mockRepository.events.filter((event)=>{ 
                return event.id==idEvent
            }))[0].participantes
        },
        getEvent:(idEvent)=>{
            return mockRepository.events.filter((event)=>{ 
                return event.id==idEvent??event  
            })
        },
        deleteEvent:(dataEvent)=>{
            return mockRepository.events.filter((event)=>{
                return event.id!=dataEvent.id??event 
            })
        },
        deleteParticipationAnEvent:(idEvent, idUser)=>{
            return true
        },
        getEventsUser:(data)=>{
            return true
        },
        updateStateEvent1:()=>{
            return true
        },
        updateStateEvent2:()=>{
            return true
        },
        updateEvent:(data,id)=>{
            return true
        },
        participateInEvent:(idUser,idEvent)=>{ 
            return idUser==idEvent},
        getLeaders:(data)=>{
            return data.lider
        },
        getMyEvents:(data)=>{
            return {
                rows:data.eventos
            }
        }
    }
    beforeAll(()=>{
        eventService=new EventService(mockRepository);
        let categories=["Animales","Comunidad","Trabajo Social","Educación"];
        let userOne={
            id:1,
            nombre:"Connor",
            LastName:"McGregor"
        };
        let userTwo={
            id:2,
            nombre:"Leprechaun",
            LastName:"Irish"
        };
        let liderOne={
            id:1,
            nombre:userOne.nombre,
            categoria:"Lider"
        }
        let firstEvent={
            id:1,
            nombre_evento:"Fundación",
            lider:liderOne.nombre,
            fechaInicio:"17/25/23",
            fechaFin:"18/09/25",
            participantes:[userTwo,userOne]
        };
        let secondEvent={
            id:2,nombre_evento:"Recaudacion",
            lider:liderOne.nombre,
            fechaInicio:"17/25/23",
            fechaFin:"18/09/25",
            participantes:[userOne]
        };
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

    it('Should return false when validate function is called with empty nombre_evento',()=>{
        const data = {
            nombre_evento: "Visita a Champarrancho"
        };
        const isValid=eventService.validate(data)
        expect(isValid).toBe(true)
    });
    
    it('should return true when validate function is called with non-empty nombre_evento',() => {
        const data = {
            nombre_evento: ""
        };
        try{
            eventService.validate(data)
        }
        catch(error){
            expect(error).toBe("Por favor ingrese un nombre del evento")
        }
    });

    it('Should return all events when this is success',async ()=>{
        const countEventos=2;
        const spyGetEvent=jest.spyOn(mockRepository,'getEvents')
        const response=await eventService.getEvents("")
        expect(spyGetEvent).toHaveBeenCalled()
        expect(response).toHaveLength(countEventos)
    })

    it('Should return all events when this is success',async ()=>{
        data={}
        const spyGetEvent=jest.spyOn(mockRepository,'getEventsUser')
        const response=await eventService.getEventsUser(data)
        expect(spyGetEvent).toHaveBeenCalled()
        expect(response).toEqual(true)
    });
    
    it('Should return any events when this is fail',async ()=>{
        let errorMessage="No se puedo obtener el evento21"
        const spyGetEventError=jest.spyOn(mockRepository,'getEvents').mockReturnValue( ()=>{throw new Error(errorMessage)})
        const response= await eventService.getEvents("");
        expect(spyGetEventError).toHaveBeenCalled()
        expect(response).toThrowError(errorMessage)
    });

    it('Should return all categories of events when this success',async ()=>{
        data={}
        const count_categories=4;
        const spyGetCategorias=jest.spyOn(mockRepository,'getCategories')
        const response=await eventService.getCategories(data);
        expect(spyGetCategorias).toHaveBeenCalled()
        expect(response).toHaveLength(count_categories)
    });

    it('Should get one event of events by id when this success',async()=>{
        let data={
                req:{
                    rows:{
                        id:2
                    }
                }
        }
        const spyGetEvento=jest.spyOn(mockRepository,'getEvent')
        const response=await eventService.getEvent(data.req.rows.id);
        expect(spyGetEvento).toHaveBeenCalled()
        expect(response[0].id).toBe(data.req.rows.id)
    });

    it('Should delete one event of events by id when this success ',async ()=>{
        let data={
            id:2,
            nombre_evento:"Agua es oro"
        }
        const spyDeleteEvent= jest.spyOn(mockRepository,'deleteEvent')
        const response=await eventService.deleteEvent(data);
        expect(spyDeleteEvent).toHaveBeenCalled()
        expect(response).toHaveLength(1)
    });

    it('Should return Error when this fail ',async ()=>{
        let data={
            id:2,
            nombre_evento:""
        }
        const errorMessage=new Error("Algo inesperado paso con el repositorio");
        const response=await eventService.deleteEvent(data);
        expect(response).toEqual(errorMessage)
    });
    
    it('should get all participants of one event when this success',async ()=>{
        let data={
                req:{
                    rows:{
                        id:1
                    }
                }
        }
        const spyGetAllParticipants= jest.spyOn(mockRepository,'getAllParticipantsForAnEvent')
        const response=await eventService.getAllParticipantsForAnEvent(data.req.rows.id);
        expect(spyGetAllParticipants).toHaveBeenCalledTimes(1)
        expect(response).toHaveLength(2)
    });

    it('Should create new event and return success message',async()=>{
        const data={
            id:3,
            nombre_evento:"Fundación",
            lider:"",
            fechaInicio:"17/25/23",
            fechaFin:"18/09/25",
            participantes:[]
        };
        const spyCreateEvent= jest.spyOn(mockRepository,'createEvent')
        const response=await eventService.createEvent(data);
        expect(spyCreateEvent).toHaveBeenCalledTimes(1)
        expect(response).toEqual(true)
    });

    it('Should not create new event and return fail message',async()=>{
        const errorMessage=new Error("Algo inesperado paso con el repositorio")
        const data={
            id:3,
            nombre_evento:"",
            lider:"",
            fechaInicio:"17/25/23",
            fechaFin:"18/09/25",
            participantes:[]
        };
        const response=await eventService.createEvent(data);
        expect(response).toEqual(errorMessage)
    });

    it('Should update one event and return success message',async()=>{
        const data={
            id:3,
            nombre_evento:"Fundación",
            lider:"",
            fechaInicio:"17/25/23",
            fechaFin:"18/09/25",
            participantes:[]
        };
        const spyUpdateEvent= jest.spyOn(mockRepository,'updateStateEvent1')
        const response=await eventService.update_evento_estado1(data);
        expect(spyUpdateEvent).toHaveBeenCalledTimes(1)
        expect(response).toEqual(true)
    });

    it('Should not update one event and return fail message',async()=>{
        const error=new Error("Algo inesperado paso con el repositorio");
        const data={
            id:3,
            nombre_evento:"",
            lider:"",
            fechaInicio:"17/25/23",
            fechaFin:"18/09/25",
            participantes:[]
        };
        const response=await eventService.update_evento_estado1(data);
        expect(response).toEqual(error)
    });

    it('Should delete one participant and return success message',async()=>{
        const data={
            id:3,
            nombre_evento:"Fundación",
            lider:"",
            fechaInicio:"17/25/23",
            fechaFin:"18/09/25",
            participantes:[]
        };
        const spyDeleteParticipant= jest.spyOn(mockRepository,'deleteParticipationAnEvent')
        const response=await eventService.deleteParticipationAnEvent(data.id,data.id);
        expect(spyDeleteParticipant).toHaveBeenCalledTimes(1)
        expect(response).toEqual(true)
    });

    it('Should not delete one participant and return fail message',async()=>{
        const errorMessage=new Error("Error al eliminar participacion");
        const data={
            id:3,
            nombre_evento:"",
            lider:"",
            fechaInicio:"17/25/23",
            fechaFin:"18/09/25",
            participantes:[]
        };
        const spyDeleteParticipant= jest.spyOn(mockRepository,'deleteParticipationAnEvent').mockImplementation(async()=>Promise.reject(new Error("a")))
        const response=await eventService.deleteParticipationAnEvent(data.id,data.id).catch(e=>e);
        expect(spyDeleteParticipant).toHaveBeenCalledTimes(1)
        expect(response).toEqual(errorMessage)
    });

    it('Should update one event and return success message',async()=>{
        const data={
            id:3,
            nombre_evento:"Fundación",
            lider:"",
            fechaInicio:"17/25/23",
            fechaFin:"18/09/25",
            participantes:[]
        };
        const spyUpdateEvent1= jest.spyOn(mockRepository,'updateStateEvent2')
        const response=await eventService.updateStateEvent2(data);
        expect(spyUpdateEvent1).toHaveBeenCalledTimes(1)
        expect(response).toEqual(true)
    });

    it('Should not update one event and return error message',async()=>{
        const error=new Error("Algo inesperado paso con el repositorio");
        const data={
            id:3,
            nombre_evento:"",
            lider:"",
            fechaInicio:"17/25/23",
            fechaFin:"18/09/25",
            participantes:[]
        };
        const response=await eventService.updateStateEvent2(data);
        expect(response).toEqual(error)
    });

    it('Should update one event and return success message',async()=>{
        const data={
            id:3,
            nombre_evento:"Fundación",
            lider:"",
            fechaInicio:"17/25/23",
            fechaFin:"18/09/25",
            participantes:[]
        };
        const spyUpdateEvent1= jest.spyOn(mockRepository,'updateEvent')
        const response=await eventService.updateEvent(data,data.id);
        expect(spyUpdateEvent1).toHaveBeenCalledTimes(1)
        expect(response).toEqual(true)
    });

    it('Should not update one event and return error message',async()=>{
        const error=new Error("Error al actualizar evento!");
        const data={
            id:3,
            nombre_evento:"",
            lider:"",
            fechaInicio:"17/25/23",
            fechaFin:"18/09/25",
            participantes:[]
        };
        const response=await eventService.updateEvent(data,data.id).catch((error)=>{return error});
        expect(response).toEqual(error)
    });

    it('Should add participant on one event and return success message',async ()=>{
        const user={
            id:3
        }
        const data={
            id:3,
            nombre_evento:"Fundación",
            lider:"",
            fechaInicio:"17/25/23",
            fechaFin:"18/09/25",
            participantes:[]
        };
        const spyParticipate= jest.spyOn(mockRepository,'participateInEvent')
        const response=await eventService.participateInEvent(user.id,data.id);
        expect(spyParticipate).toHaveBeenCalledTimes(1)
        expect(response).toEqual(true)
    });

    it('Should not add participant on one event and return fail message',async ()=>{
        const user={
            id:1
        }
        const data={
            id:3,
            nombre_evento:"Fundación",
            lider:"",
            fechaInicio:"17/25/23",
            fechaFin:"18/09/25",
            participantes:[]
        };
        const errorMessage="El 1 del evento no existe"
        const spyParticipate= jest.spyOn(mockRepository,'participateInEvent').mockImplementation(()=>Promise.reject(new Error()))
        const response=await eventService.participateInEvent(user.id,data.id).catch((error)=>{return error})
        expect(spyParticipate).toHaveBeenCalledTimes(1)
        expect(response.message).toEqual(errorMessage)
    });

    it('Should return all leaders on one event and return success message',async ()=>{ 
        const user={
            id:3,
            name:"Connor"
        }
        const data={
            id:3,
            nombre_evento:"Fundación",
            lider:user.name,
            fechaInicio:"17/25/23",
            fechaFin:"18/09/25",
            participantes:[]
        };
        const spyLeaders= jest.spyOn(mockRepository,'getLeaders')
        const response=await eventService.getLeaders(data)
        expect(spyLeaders).toHaveBeenCalledTimes(1)
        expect(response).toEqual(data.lider)
    });

    it('Should not return all leaders on one event and return fail message',async ()=>{
        const data={
            id:3,
            nombre_evento:"Fundación",
            lider:"",
            fechaInicio:"17/25/23",
            fechaFin:"18/09/25",
            participantes:[]
        };
        const errorMessage="No existe ningun lider"
        const spyLeaders= jest.spyOn(mockRepository,'getLeaders').mockImplementation(()=>Promise.reject(new Error(errorMessage)))
        const response=await eventService.getLeaders(data).catch((error)=>{return error})
        expect(spyLeaders).toHaveBeenCalledTimes(1)
        expect(response.message).toEqual(errorMessage)
    });

    it('Should return all events on one participant and return success message',async ()=>{ 
        const data={
            id:3,name:"Connor",
            eventos:[
                {
                    id:1, 
                    evento:"a",
                    fecha_evento:"13/12/22",
                    hora_inicio:"17:15"
                },
                {
                    id:2,
                    evento:"b",
                    fecha_evento:"17/12/22",
                    hora_inicio:"07:15"
                },
                {
                    id:3,
                    evento:"c",
                    fecha_evento:"07/12/22",
                    hora_inicio:"00:15"
                }
            ]
        }
        const spyMyEventos= jest.spyOn(mockRepository,'getMyEvents')
        const response=await eventService.getMyEvents(data)
        expect(spyMyEventos).toHaveBeenCalledTimes(1)
        expect(response).toEqual(data.eventos)
    });

    it('Should not return events on one participant and return fail message',async ()=>{
        const data=""
        const errorMessage="Algo inesperado paso con la Base de datos o el id del participante no existe"
        const spyLeaders= jest.spyOn(mockRepository,'getMyEvents').mockImplementation(()=>Promise.reject(new Error()))
        const response=await eventService.getMyEvents(data).catch((error)=>{return error})
        expect(spyLeaders).toHaveBeenCalledTimes(1)
        expect(response.message).toEqual(errorMessage)
    });
})