import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectComponent } from './select.component';
import { By } from '@angular/platform-browser';


describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectComponent, SelectComponent, ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default valueSelectStatus as empty string', () => {
    expect(component.valueSelectStatus).toBe('');
  });

  it('should emit valueSelectStatusChange when valueSelectStatus is set to a new value', () => {
    jest.spyOn(component.valueSelectStatusChange, 'emit');
    component.valueSelectStatus = 'Alive';
    expect(component.valueSelectStatusChange.emit).toHaveBeenCalledWith('Alive');
  });

  it('should not emit valueSelectStatusChange when valueSelectStatus is set to the same value', () => {
    component.valueSelectStatus = 'Dead';
    jest.spyOn(component.valueSelectStatusChange, 'emit');
    component.valueSelectStatus = 'Dead';
    expect(component.valueSelectStatusChange.emit).not.toHaveBeenCalled();
  });

  it('should update _valueSelectStatus when valueSelectStatus is set', () => {
    component.valueSelectStatus = 'Unknown';
    expect((component as any)._valueSelectStatus).toBe('Unknown');
  });
});
