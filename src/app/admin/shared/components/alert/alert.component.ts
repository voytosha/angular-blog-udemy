import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AlertService} from '../../services/alert.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {

  @Input() delay = 5000; // imposto la durata della visualizzazione dell'alert
  public text: string;
  public type = 'success';
  alertSub: Subscription;

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.alertSub = this.alertService.alert$.subscribe(alert => {
      this.text = alert.text;
      this.type = alert.type;

      const timeout = setTimeout( () => {
        clearTimeout(timeout);
        this.text = ''}, this.delay);
      });
  }

  ngOnDestroy(): void {
    // если этот алерт существует, мы от него отписываемся:
    if (this.alertSub) {
      this.alertSub.unsubscribe();
    }
  }
}
