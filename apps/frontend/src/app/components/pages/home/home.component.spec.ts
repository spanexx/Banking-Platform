import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FontAwesomeModule,
        HomeComponent
      ],
      providers: [
        provideRouter([]),
        provideLocationMocks()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render features', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelectorAll('.feature-card').length).toBe(4);
  });
});
