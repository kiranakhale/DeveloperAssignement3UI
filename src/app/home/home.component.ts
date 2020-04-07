import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Training } from '../models/training';
import { ApiTrainingService } from '../api.training';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [ApiTrainingService]
})
export class HomeComponent implements OnInit{
  startDate;
  endDate;
  nameValue;
  isDateValid = true;
  _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage = '';

  constructor(private apiService: ApiTrainingService) { }

  ngOnInit(): void {
    setTimeout(() => this.staticAlertClosed = true, 20000);

    this._success.subscribe(message => this.successMessage = message);
    this._success.pipe(
      debounceTime(3000)
    ).subscribe(() => this.successMessage = '');

  }
  dateChange(event) {
    if (!this.endDate) return;
    if (new Date(this.startDate.year, this.startDate.month, this.startDate.day) >
      new Date(this.endDate.year, this.endDate.month, this.endDate.day)) {
      this.isDateValid = false;
    }
    else {
      this.isDateValid = true;
    }
  }

  submitForm(form: NgForm) {
    var fData = form.value;
    console.log(fData);
    var eDate = new Date(fData.dp2.year, fData.dp2.month, fData.dp2.day);
    var sDate = new Date(fData.dp1.year, fData.dp1.month, fData.dp1.day);
    var customer: Training = {
      TrainingName : fData.name,
      EndDate : eDate,
      StartDate : sDate
    };
    this.apiService.addTraining(customer).subscribe((res) => {
      this._success.next(res);
      form.reset();
    });
  }
}
