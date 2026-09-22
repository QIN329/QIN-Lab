export default class RoomManager {


constructor(parentGroup){


    this.parentGroup = parentGroup;


    this.rooms = {};


    this.current = null;


}







register(name,room){


    this.rooms[name]=room;


}







open(name){


    const room =
        this.rooms[name];



    if(!room){


        console.warn(
            "Room does not exist:",
            name
        );


        return;


    }





    if(this.current){


        this.parentGroup.remove(

            this.current.getObject()

        );


    }





    this.current = room;





    this.parentGroup.add(

        room.getObject()

    );





    room.start?.();


}








update(delta){


    this.current?.update?.(
        delta
    );


}








getInteractiveObjects(){


    return (

        this.current?.getInteractiveObjects?.()

        ||

        []

    );


}








close(){


    if(this.current){


        this.parentGroup.remove(

            this.current.getObject()

        );


        this.current=null;


    }


}


}