import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SmartAuthService} from '../smart-auth.service';
import {Patient} from 'fhir';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  ptName = 'Patient name not yet retrieved';
  ptFhir: Patient;

  constructor(private route: ActivatedRoute, private smartService: SmartAuthService) {
  }

  ngOnInit() {
    this.smartService.initialize(this.route).subscribe(sb => {
      this.getPatientName();
    });
  }

  getPatientName() {
    this.smartService.getPatient().subscribe(patient => {
      this.ptFhir = patient;
      this.ptName = this.ptFhir.name[0].given + ' ' + this.ptFhir.name[0].family;
    });
  }

  connectToFhirEndpoint() {
    this.smartService.connectToEndpoint(
      'https://open-ic.epic.com/argonaut/api/FHIR/Argonaut/').subscribe(value => {
    });
  }
}
