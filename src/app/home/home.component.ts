import {Component, computed, effect, inject, Injector, signal} from '@angular/core';
import {CoursesService} from "../services/courses.service";
import {Course, sortCoursesBySeqNo} from "../models/course.model";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {CoursesCardListComponent} from "../courses-card-list/courses-card-list.component";
import {MatDialog} from "@angular/material/dialog";
import {MessagesService} from "../messages/messages.service";
import {catchError, from, throwError} from "rxjs";
import {toObservable, toSignal, outputToObservable, outputFromObservable} from "@angular/core/rxjs-interop";
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';
import { LoadingService } from '../loading/loading.service';

@Component({
  selector: 'home',
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    CoursesCardListComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  #courses = signal<Course[]>([]);

  coursesService = inject(CoursesService);

  loadingService = inject(LoadingService);

  dialog = inject(MatDialog);

  beginnerCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter(course => course.category === "BEGINNER")
  });

  advancedCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter(course => course.category === "ADVANCED")
  });


  constructor() {
    effect(() => {
      console.log('Beginner courses: ' + this.beginnerCourses);
      console.log('Advanced courses: ' + this.advancedCourses);
    })
   this.loadCourses().then(() => console.log('All course loaded ', this.#courses()));
  }

  async loadCourses() {
    
    try {
      this.loadingService.loadingOn();
      const courses = await this.coursesService.loadAllCourses();
      this.#courses.set(courses.sort(sortCoursesBySeqNo));
    }
    catch(err) {
      this.loadingService.loadingOff();
      alert('error occured');
      console.error(err);
    }
    finally {
      this.loadingService.loadingOff();

    }
  }

  onCourseUpdated(updatedCourse:Course) {
    const courses = this.#courses();

    const newCourses = courses.map(course => {
      return course.id === updatedCourse.id? updatedCourse :course
    });

    this.#courses.set(newCourses);
  }

  async onCourseDeleted(courseId: string) {
    try {
      await this.coursesService.deleteCourse(courseId);

      const courses = this.#courses();
      const newCourses = courses.filter(
        course => course.id != courseId)
      
        this.#courses.set(newCourses);

    }
    catch(err) {
      console.log(err);
      alert('Error deleting course');
    }
  }

  async onAddCourse() {
    const newCourse = await openEditCourseDialog(
      this.dialog, 
      {
        mode: 'create',
        title: "Create New Course"
      });

      const newCourses = [
        ...this.#courses(),
        newCourse      
      ]

      this.#courses.set(newCourses);
  }

}
