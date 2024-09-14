import { Component, inject, signal } from '@angular/core';
import { Course } from '../models/course.model';
import { Lesson } from '../models/lesson.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'course',
  standalone: true,
  imports: [],
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss'
})
export class CourseComponent {

  course = signal<Course | null>(null);

  lesssons = signal<Lesson[]>([]);

  route = inject(ActivatedRoute);
  
  ngOnInit() {
    this.course.set(this.route.snapshot.data["course"]);
    this.lesssons.set(this.route.snapshot.data["lessons"]);
  }

}
