import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SkinAnalysisService {
  private baseUrl = `${environment.apiUrl}/skin/analyse`;

  constructor(private http: HttpClient) {}

  analyseSkin(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('skinImage', file);

    return this.http.post(this.baseUrl, formData, { withCredentials: true });
  }
}
