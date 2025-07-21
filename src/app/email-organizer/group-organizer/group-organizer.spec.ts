import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupOrganizer } from './group-organizer';

describe('GroupOrganizer', () => {
  let component: GroupOrganizer;
  let fixture: ComponentFixture<GroupOrganizer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupOrganizer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupOrganizer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
