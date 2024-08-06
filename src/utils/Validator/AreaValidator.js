module.exports = class AreaValidator 
{
    checkBoolIteration(object, areas = [])
    {
        let bool = true;
        for(let i=0; i<areas.length; i++)
            bool = bool && object[areas[i]];
        return bool;
    }

    checkBool = (object) => {
        return (
          object.maxLatitude &&
          object.minLatitude &&
          object.originX &&
          object.originY &&
          object.maxLongitude &&
          object.minLongitude &&
          object.radius &&
          object.name
        );
    };

    check = (object, areas = [])=>{
        for(let i=0; i<areas.length; i++)
            if(!object[areas[i]])
                return false;
        return true;
    }
      
}