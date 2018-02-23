import {Component, OnInit} from '@angular/core';
import {SmartAuthService} from '../smart-auth.service';
import {FhirEndpoint} from '../fhir-endpoint';

@Component({
  selector: 'app-epic-auth',
  templateUrl: './epic-auth.component.html',
  styleUrls: ['./epic-auth.component.css']
})
export class EpicAuthComponent implements OnInit {
  endpoints: FhirEndpoint[];
  selectedEndpoint: string;

  constructor(private smartService: SmartAuthService) {
  }

  ngOnInit() {
    this.smartService.getEndpointList().subscribe( endpoints => {
      this.endpoints = endpoints;
      console.log(endpoints);
    });
  }

  connectToEndpoint(endpoint: string) {
    console.log('ready to connect to endpoint: ' + endpoint);
    this.smartService.connectToEndpoint(endpoint);

    // this.smartService.goToAuthenticationWebsite(400, 200);
  }

}
