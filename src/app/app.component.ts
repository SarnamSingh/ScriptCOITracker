import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AppService } from './app.service';
import {environment} from '../environments/environment';
import { observable, Subject } from 'rxjs';
import {script} from './scriptModel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[AppService]
})
export class AppComponent {
  title = 'scriptcoitracker';
  trackingStatus = '';
  selectedStock$ = new Subject<script[]>();
  scriptArray:Array<script> = [];
  currentProgress = 0;

   @ViewChild('progressBar')
   private  progressBar: ElementRef;
  
  constructor(private appService:AppService){
    
    }

  getContentFromAnotherPortal(){
    this.currentProgress = 0;
    this.progressBar.nativeElement.style.display ="block";
    this.scriptArray.length = 0;
    environment.stockList.forEach((item,idx)=>{
      const url = environment.stockMarketOffcialWebsite.replace(/script/g, item);
      this.appService.getHtml(url).subscribe(
        (data)=>{
        this.currentProgress++;
        let doc:Document =  (new DOMParser()).parseFromString(data, "text/html");
        let tableElement = doc.querySelector("#octable");
        let rowcollection =  tableElement.querySelectorAll('tr');
        for (let i=0; i< rowcollection.length-1; i++)
        {
          if(i > 1){
          let callCOI = rowcollection[i].querySelector('td:nth-of-type(3)').textContent;
          let putCOI  = rowcollection[i].querySelector('td:nth-of-type(21)').textContent;
          callCOI = callCOI && callCOI.indexOf(',') >= 0 ? (callCOI.replace(/\,/g,'')).replace("-","") : callCOI.replace("-","");
          putCOI = putCOI && putCOI.indexOf(',') >= 0 ? (putCOI.replace(/\,/g,'')).replace("-","") : putCOI.replace("-","");
          if (+callCOI > environment.minCOIRequired || +putCOI > environment.minCOIRequired){
            this.scriptArray.push({"name":item, "coi":+callCOI>+putCOI?+callCOI:+putCOI})
            this.selectedStock$.next(this.scriptArray);
            break;
          }
          }
        }
        if(this.currentProgress === environment.stockList.length){
          this.progressBar.nativeElement.style.display ="none";
        }
          
        },
    );
    });
    
  
  }
 
}
