import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { EnderecoService } from '../service/endereco.service';

import { EnderecoComponent } from './endereco.component';

describe('Component Tests', () => {
  describe('Endereco Management Component', () => {
    let comp: EnderecoComponent;
    let fixture: ComponentFixture<EnderecoComponent>;
    let service: EnderecoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [EnderecoComponent],
      })
        .overrideTemplate(EnderecoComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EnderecoComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(EnderecoService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.enderecos?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
