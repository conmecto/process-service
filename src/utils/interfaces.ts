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
    age: number,
    city?: string,
    country: string, 
    searchFor: string,
    searchIn: string,
    gender: string,
    minSearchAge: number,
    maxSearchAge: number,
    currentMatch?: number,
}

interface ICreatePossibleMatchResponse {
    userId2: number
}

export { 
    IGeneric, IRequestObject, IGenericResponse, IGetSettingObject, ICreatePossibleMatchResponse
};