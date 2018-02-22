import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {isUndefined} from 'util';
import {Observable} from 'rxjs/Observable';
import {Patient} from 'fhir';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {SmartBundle} from './SmartBundle';
import {of} from 'rxjs/observable/of';

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
  serviceUri: string;
  private sub: any;
  private sb: SmartBundle;

  constructor(private http: HttpClient) {
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

        console.log('session parameters');
        console.log(sessionParams);

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
              console.log('received data from server');
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
