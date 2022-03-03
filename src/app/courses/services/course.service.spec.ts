import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CoursesService } from "./courses.service";
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { Course } from "../model/course";
import { execPath } from "process";
import { HttpErrorResponse } from "@angular/common/http";

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

    it('should save the course data', () => {
        const change: Partial<Course> = {titles: {description: 'new Angular Testing Course'}};
        courseService.saveCourse(12, change).subscribe(course => {
            expect(course.id).toBe(12);
        });

        const req = httpTestingController.expectOne('/api/courses/12');

        expect(req.request.method).toBe('PUT');

        expect(req.request.body.titles.description).toEqual(change.titles.description);

        req.flush({
            ...COURSES[12],
            ...change
        })
    })

    it('should give an error if save course fails', () => {
        const change: Partial<Course> = {titles: {description: 'new Angular Testing Course'}};
        courseService.saveCourse(12, change).subscribe(
            () => fail("the save operation should fail"), (error: HttpErrorResponse) => {
                expect(error.status).toBe(500);
            });
        const req = httpTestingController.expectOne('/api/courses/12');

        expect(req.request.method).toBe('PUT');

        req.flush('Save course failed', {status: 500, statusText: 'Internal server error'})
    })

    it('should find a list of lessons', () => {
        courseService.findLessons(12).subscribe(lessons => {
            expect(lessons).toBeTruthy();
            expect(lessons.length).toBe(3);
        })

        const req = httpTestingController.expectOne(req => req.url === '/api/lessons');

        expect(req.request.method).toBe('GET');
        expect(req.request.params.get("courseId")).toBe("12");

        req.flush({
            payload: findLessonsForCourse(12).slice(0, 3)
        })
    })

    afterEach(() => {
        httpTestingController.verify();
    })
})