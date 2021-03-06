///<reference path="../../node_modules/@types/node/index.d.ts"/>
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {isUndefined} from 'util';
import {Observable} from 'rxjs/Observable';
import {Patient} from 'fhir';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {SmartBundle} from './SmartBundle';
import {of} from 'rxjs/observable/of';
import {AppConfig} from './app.config';
import {FhirEndpoint} from './fhir-endpoint';
import {FhirExtension} from './shared/fhir-extension';

@Injectable()
export class SmartAuthService {
  // // get the URL parameters received from the authorization server
  // state: string;  // session key
  // code: string;    // authorization code
  // urlParams: any;  // app session url parameters
  // // Session parameters
  // tokenUri: string;
  // clientId: string;
  // secret: string;
  // redirectUri: string;
  checkConnect: any;
  serviceUri: string;
  private sub: any;
  private sb: SmartBundle;
  private config: AppConfig;

  constructor(private http: HttpClient) {
    this.config = require('./config/app.config.json');
  }

  getEndpointList(): Observable<FhirEndpoint[]> {
    const endpoints = <FhirEndpoint[]>require('./config/epic-endpoints.json');
    return of(endpoints);
  }

  goToAuthenticationWebsite(w, h) {
    const left = (screen.width / 2) - (w / 2);
    const top = (screen.height / 2) - (h / 2);
    const clientId = 'e4b32d61-d82e-4de0-b6ff-0f8f5f3ba887';
    const redirectUri = 'http://localhost:4200/afterlaunch';
    const baseUri = 'https://open-ic.epic.com/argonaut';
    // const baseUri = 'https://epic-soap-test.uchealth.com/FHIRProxy';
    const win = window.open(baseUri + '/oauth2/authorize?response_type=code&client_id=' + clientId + '&redirect_uri=' + redirectUri,
      '_blank', 'location=yes,height=' + h + ',width=' + w + ',top=' + top + ',left=' + left + 'scrollbars=yes,status=yes');
    this.checkConnect = window.setInterval(function () {
      if (win.document.URL.indexOf('code') !== -1) {
        window.clearInterval(this.checkConnect);
        const url = win.document.URL;
        win.opener.location.href = url;
        win.close();
      }
    }, 800);
  }

  connectToEndpoint(endpoint: string) {
    // return new Observable<SmartBundle>(observer => {
    console.log('Attempting to connect to endpoint ' + endpoint);

    let authUri: string;
    let tokenUri: string;

    const w = 0;
    const h = 0;
    const left = (screen.width / 2) - (w / 2);
    const top = (screen.height / 2) - (h / 2);

    const clientId = 'e4b32d61-d82e-4de0-b6ff-0f8f5f3ba887';
    const redirectUri = 'http://localhost:4200/afterlaunch';
    // const baseUri = 'https://open-ic.epic.com/argonaut';
    // const baseUri = 'https://epic-soap-test.uchealth.com/FHIRProxy';
    const win = window.open('https://open-ic.epic.com/Argonaut/oauth2/authorize?response_type=code&client_id=' + clientId + '&redirect_uri=' + redirectUri,
      '_blank', 'location=yes,height=' + h + ',width=' + w + ',top=' + top + ',left=' + left + 'scrollbars=yes,status=yes');
    this.checkConnect = window.setInterval(function () {
      if (win.document.URL.indexOf('code') !== -1) {
        window.clearInterval(this.checkConnect);
        const url = win.document.URL;
        win.opener.location.href = url;
        win.close();
      }
    }, 800);


    // const redirectUri = window.location.protocol + '//' + window.location.host + this.config.landingUri;

    this.http.get(endpoint + 'metadata', {headers: new HttpHeaders().set('content-type', 'application/json')}).subscribe(metadata => {
      try {
        const extensions = <FhirExtension[]>metadata['rest'][0]['security']['extension'][0]['extension'];
        for (const extension of extensions) {
          if (extension.url === 'authorize') {
            authUri = extension.valueUri;
          } else if (extension.url === 'token') {
            tokenUri = extension.valueUri;
          }
        }
      } catch (e) {
        console.log('Error retreiving conformance extensions: ' + e);
      }

      console.log(authUri);
      console.log(tokenUri);

      if (authUri && tokenUri) {
        // const authWindowUri = authUri + '?response_type=code&client_id='
        // + this.config.clientId + '&redirect_uri=' + this.config.landingUri;
        // const authWindowUri = authUri + '?response_type=code&client_id='
        // + this.config.clientId + '&redirect_uri=' + 'http://localhost:4200/afterlaunch';
        // const win = window.open(
        //   authWindowUri,
        //   '_blank',
        //   'location=yes,height=' + h + ',width=' + w + ',top=' + top + ',left=' + left + 'scrollbars=yes,status=yes');
        // this.checkConnect = window.setInterval(function () {
        //   if (win.document.URL.indexOf('code') !== -1) {
        //     window.clearInterval(this.checkConnect);
        //     const url = win.document.URL;
        //     win.opener.location.href = url;
        //     win.close();
        //   }
        // }, 800);

        // const left = (screen.width / 2) - ( w / 2);
        // const top = ( screen.height / 2 ) - ( h / 2 );
      }

    });
    // // const clientId = 'e4b32d61-d82e-4de0-b6ff-0f8f5f3ba887';
    // // const redirectUri = 'http://localhost:4200/afterlaunch';
    // // const baseUri = 'https://open-ic.epic.com/argonaut';
    // // const baseUri = 'https://epic-soap-test.uchealth.com/FHIRProxy';
    // const win = window.open(this.config.launchUri +
    // '/oauth2/authorize?response_type=code&client_id=' + clientId +
    // '&redirect_uri=' + redirectUri,
    //   '_blank', 'location=yes,height=' + h + ',width=' + w + ',top=' + top + ',left=' + left + 'scrollbars=yes,status=yes');
    // window.setInterval(function() {
    //   if (win.document.URL.indexOf('code') !== -1) {
    //     window.clearInterval(this.checkConnect);
    //     const url = win.document.URL;
    //     win.opener.location.href = url;
    //     win.close();
    //   }
    // }, 800);
    // });
  }

  initialize(route: ActivatedRoute): Observable<SmartBundle> {
    if (this.sb) {
      return of(this.sb);
    }

    return new Observable<SmartBundle>((observer) => {
      // get the parameters from the URL
      this.sub = route.queryParams.subscribe(params => {
        const urlParams = params;

        // Get URL parameters as passed in URL from auth server
        const state = this.getUrlParameter(urlParams, 'state');
        const code = this.getUrlParameter(urlParams, 'code');

        // Load app parameters stored in session
        const sessionParams = JSON.parse(sessionStorage[state]);

        this.serviceUri = sessionParams.serviceUri;

        if (sessionParams.accessToken && sessionParams.patientId) {
          this.sb = new SmartBundle(sessionParams.accessToken, sessionParams.patientId);
          observer.next(this.sb);
        } else {
          const tokenUri = sessionParams.tokenUri;
          const clientId = sessionParams.clientId;
          const secret = sessionParams.secret;
          const redirectUri = sessionParams.redirectUri;

          // Prep the token exchange call parameters
          const httpParams = new HttpParams()
            .set('code', code)
            .set('grant_type', 'authorization_code')
            .set('redirect_uri', redirectUri)
            .set('client_id', clientId);

          this.http.post(tokenUri, httpParams).subscribe(
            res => {
              this.sb = new SmartBundle(res['access_token'], res['patient']);

              sessionParams.accessToken = this.sb.accessToken;
              sessionParams.patientId = this.sb.patientId;

              sessionStorage[state] = JSON.stringify(sessionParams);

              observer.next(this.sb);
            }
          );
        }
      });

    });

  }

  getPatient(): Observable<Patient> {
    if (!this.sb) {
      // return Observable.throw('no access token');
      return ErrorObservable.create('no access token');
    }

    return this.http.get<Patient>(
      this.serviceUri + '/Patient/' + this.sb.patientId, {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.sb.accessToken)
      }
    );
  }

  private getUrlParameter(urlParams: any, sParam: string): string {
    if (isUndefined(urlParams[sParam])) {
      console.log('parameter ' + sParam + ' does not exist');
      return '';
    }
    return urlParams[sParam];
  }
}
