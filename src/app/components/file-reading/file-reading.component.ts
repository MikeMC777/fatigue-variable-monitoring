import { PlotSentI } from 'src/app/models/plotSent';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CrudFileReadingService } from 'src/app/services/crud-file-reading.service';
import { SocketWebService } from 'src/app/services/socket-web.service';

@Component({
  selector: 'fvm-file-reading',
  templateUrl: './file-reading.component.html',
  styleUrls: ['./file-reading.component.scss']
})
export class FileReadingComponent implements OnInit, AfterViewInit {
  query: string = '...\n';
  constructor(private _socketWebService: SocketWebService, private _fileReadingService: CrudFileReadingService, private _authService: AuthService) {

  }
  ngAfterViewInit(): void {

    this._socketWebService.outEvent.subscribe(res => {
      console.log('hola16', res);
      this.query = 'Leyendo puerto serial...\n';
      this.getLastReadings();
    })
  }

  ngOnInit(): void {
    this.getLastReadings();
  }

  getLastReadings() {
    return this._fileReadingService.loadFileReading().toPromise()
      .then(data => {
        if (data.success) {
          const plotSentArray: Array<PlotSentI> = data.result;
          plotSentArray.forEach(plotSentItem => {
            this.query += plotSentItem.plot + ' - ' + new Date(plotSentItem.registered_at) + '\n';
          });
        } else {
          this._authService.getErrorTable();
        }
      },
      error => {
        this._authService.getErrorToken(error);
      }).catch(err => {

    })
  }

}
