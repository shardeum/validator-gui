import {Request, Response, Express} from 'express';


export function badRequestResponse(res: Response, msg: string){
    res.status(400).json({
        errorMessage: msg
    })
    res.end()
}