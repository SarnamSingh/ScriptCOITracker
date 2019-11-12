import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class AppService{
     
    constructor(private http:HttpClient){
        
    }
    getHtml(url:string){
       let headers = new HttpHeaders()
                             .set("Access-Control-Allow-Origin", "*")
                             .set('Access-Control-Allow-Methods', 'GET')
                             .set("Content-Type", "text/plain");
        return this.http.get(url, {
          headers,
          responseType:'text',
          
        });
    }
}