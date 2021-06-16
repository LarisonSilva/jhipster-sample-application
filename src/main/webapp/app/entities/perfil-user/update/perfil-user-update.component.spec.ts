jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PerfilUserService } from '../service/perfil-user.service';
import { IPerfilUser, PerfilUser } from '../perfil-user.model';

import { PerfilUserUpdateComponent } from './perfil-user-update.component';

describe('Component Tests', () => {
  describe('PerfilUser Management Update Component', () => {
    let comp: PerfilUserUpdateComponent;
    let fixture: ComponentFixture<PerfilUserUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let perfilUserService: PerfilUserService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PerfilUserUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PerfilUserUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PerfilUserUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      perfilUserService = TestBed.inject(PerfilUserService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const perfilUser: IPerfilUser = { id: 456 };

        activatedRoute.data = of({ perfilUser });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(perfilUser));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const perfilUser = { id: 123 };
        spyOn(perfilUserService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ perfilUser });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: perfilUser }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(perfilUserService.update).toHaveBeenCalledWith(perfilUser);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const perfilUser = new PerfilUser();
        spyOn(perfilUserService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ perfilUser });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: perfilUser }));
        saveSubject.complete();

        // THEN
        expect(perfilUserService.create).toHaveBeenCalledWith(perfilUser);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const perfilUser = { id: 123 };
        spyOn(perfilUserService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ perfilUser });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(perfilUserService.update).toHaveBeenCalledWith(perfilUser);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
