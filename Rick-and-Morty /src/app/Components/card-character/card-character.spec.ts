import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardCharacterComponent } from './card-character.component';

describe('CardCharacterComponent', () => {
  let component: CardCharacterComponent;
  let fixture: ComponentFixture<CardCharacterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardCharacterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardCharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be true', () => {
    expect(true).toBe(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default characters as empty array', () => {
    expect(component.characters()).toEqual([]);
  });

  it('should have default loading as false', () => {
    expect(component.loading()).toBe(false);
  });
});
