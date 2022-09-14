import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'slaFormat'
})
export class SlaFormatPipe implements PipeTransform {
  finalShow : any[] = [] ;

 
  transform(value: string): string {
    if(value != null ){
      let sla : string[] = value.split(':' , 3);
      let days = sla[0] ;
      let hours = sla[1];
      let minutes = sla[2];
      if(days != "00"){
        let _days = days.concat("d");
        this.finalShow.push(_days);
      }if(hours != "00"){
        let _hours = hours.concat("h");
        this.finalShow.push(_hours);
      }
      if(minutes != "00" || minutes == "00"){
        minutes = "";
        // let _minutes = minutes.concat("m");
        this.finalShow.push(minutes);
      }
      return this.finalShow.join();
    }
    else{
      return " ";
    }
   
  }

}
