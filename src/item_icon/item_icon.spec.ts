import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Item_icon } from './item_icon';

describe('Item_icon', () => {
  let component: Item_icon;
  let fixture: ComponentFixture<Item_icon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Item_icon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Item_icon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
