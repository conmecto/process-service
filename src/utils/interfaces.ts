// Generic
interface IGeneric {
    [key: string]: any
}

interface IGenericResponse {
    message: string
}

// Node reqeust object  
interface IRequestObject extends IGeneric {
    body: IGeneric,
    query: IGeneric,
    params: IGeneric,
    method: string,
    path: string,
    headers: IGeneric
}

//BaseModel
interface IBaseModel {
    id: number,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date
}

interface IGetSettingObject {
    id: number,
    age: number,
    city?: string,
    country: string, 
    searchFor: string,
    searchIn: string,
    gender: string,
    minSearchAge: number,
    maxSearchAge: number,
    activeMatchesCount: number,
    maxMatchesAllowed: number
}

interface ICreatePossibleMatchResponse {
    matchId: number
}

interface ISaveMessageData {
    sender: number,
    receiver: number,
    matchId: number,
    message: string,
    event: string,
    fileData: Record<string, any>
}

export { 
    IGeneric, IRequestObject, IGenericResponse, IGetSettingObject, ICreatePossibleMatchResponse, ISaveMessageData
};