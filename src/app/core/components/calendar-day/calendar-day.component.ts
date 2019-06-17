import { Component, Input, OnInit } from '@angular/core';
import { Day } from '../../models/calendar.model';
import { environment } from '../../../../environments/environment';
import { EventSidenavService } from '../../services/event-sidenav.service';
import { Event } from '../../models/event.model';
import { CalendarComponent } from '../calendar/calendar.component';
import { AssoStyle, AssoStylePipe } from '../../../shared/pipes/asso-style.pipe';

@Component({
  selector: 'app-calendar-day',
  templateUrl: './calendar-day.component.html',
  styleUrls: ['./calendar-day.component.scss'],
})
export class CalendarDayComponent implements OnInit {
  imgPath = environment.img_url;

  _day: Day;
  today: boolean;
  @Input()
  set day(day: Day) {
    this._day = day;
    const now = new Date();
    const nextDay = CalendarComponent.getNextDay(day.date);
    this.today = now >= day.date && now < nextDay;
  }
  get day() {
    return this._day;
  }

  constructor(
    private eventSidenavService: EventSidenavService,
    private assoStylePipe: AssoStylePipe,
  ) {}

  ngOnInit() {}

  selectEvent(event: Event) {
    this.eventSidenavService.setEvent(event);
  }

  nextDay(date: Date) {
    return CalendarComponent.getNextDay(date);
  }

  eventStyle(event: Event, position: number): AssoStyle {
    const style = this.assoStylePipe.transform(event.association, 'accent');
    if (this.day.events.length > 1 && position === this.day.events.length - 1) {
      style.paddingBottom = '1.4em';
    }
    return style;
  }

  dateStyle(): AssoStyle {
    const style = this.day.events.length
      ? this.assoStylePipe.transform(
          this.day.events.sort((a, b) => (a.date > b.date ? 1 : -1))[this.day.events.length - 1]
            .association,
          'accent',
          'text-shadow',
        )
      : {};
    return style;
  }
}
