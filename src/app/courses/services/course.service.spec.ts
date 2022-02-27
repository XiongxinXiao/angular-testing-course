import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CoursesService } from "./courses.service";
import { COURSES } from "../../../../server/db-data";

describe('CourseService', () => {
    let courseService: CoursesService,
        httpTestingController: HttpTestingController

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                CoursesService
            ]
        });

        courseService = TestBed.inject(CoursesService);
        httpTestingController = TestBed.inject(HttpTestingController);
    })

    it('should retrieve all courses', () => {
        courseService.findAllCourses().subscribe(courses => {
            expect(courses).toBeTruthy('No course returned');
            
            expect(courses.length).toBe(12, 'incorrect number of courses');

            const course = courses.find(course => course.id === 12);
            

            expect(course.titles.description).toBe('Angular Testing Course');
        })

        const req = httpTestingController.expectOne('/api/courses');

        expect(req.request.method).toBe('GET');

        req.flush({payload: Object.values(COURSES)});
    });
})