import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JsonLdService } from './json-ld.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { EventBand } from '../models/event-band.model';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventBandService {
  constructor(private http: HttpClient) {}

  static parseDates(eventBand: EventBand): EventBand {
    if (eventBand.endingDate) {
      eventBand.endingDate = new Date(eventBand.endingDate);
    }
    if (eventBand.startingDate) {
      eventBand.startingDate = new Date(eventBand.startingDate);
    }
    return eventBand;
  }

  public create(eventBand: EventBand): Observable<EventBand> {
    const url = `${environment.api_url}/event_bands`;
    return this.http.post<EventBand>(url, eventBand).pipe(map(EventBandService.parseDates));
  }

  public get(eventBandId: number): Observable<EventBand> {
    const url = `${environment.api_url}/event_bands/${eventBandId}`;
    return this.http.get<EventBand>(url).pipe(map(EventBandService.parseDates));
  }

  public getCalendarEventBands(date: Date = null): Observable<EventBand[]> {
    const url = `${environment.api_url}/event_bands?time=${date ? date.getTime() / 1000 : 'now'}`;
    return this.http
      .get<Event[]>(url)
      .pipe(
        map(events =>
          JsonLdService.parseCollection<EventBand>(events).collection.map(
            EventBandService.parseDates,
          ),
        ),
      );
  }

  public delete(id: number): Observable<any> {
    const url = `${environment.api_url}/event_bands/${id}`;
    return this.http.delete(url);
  }

  public put(eventBand: EventBand): Observable<EventBand> {
    const url = `${environment.api_url}/event_bands/${eventBand.id}`;
    return this.http.put<EventBand>(url, eventBand).pipe(map(EventBandService.parseDates));
  }
}