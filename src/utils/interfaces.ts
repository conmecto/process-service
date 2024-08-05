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
    country: string, 
    searchFor: string,
    gender: string,
    minSearchAge: number,
    maxSearchAge: number,
    activeMatchesCount: number,
    maxMatchesAllowed: number,
    searchArea: string,
    geohash: string
}

interface ICreatePossibleMatchResponse {
    matchId: number,
    userId: number,
    matchedUserId: number
}

interface ISaveMessageData {
    sender: number,
    receiver: number,
    matchId: number,
    message: string,
    event: string,
    fileData: Record<string, any>
}

interface ICreateSettingObject {
    userId: number,
    age: number,
    searchFor: string,
    gender: string,
    minSearchAge: number,
    maxSearchAge: number
}

interface ICreateLocationSettingObject {
    country: string, 
    userId: number
}

export { 
    IGeneric, IRequestObject, IGenericResponse, IGetSettingObject, ICreatePossibleMatchResponse, ISaveMessageData,
    ICreateSettingObject, ICreateLocationSettingObject
};