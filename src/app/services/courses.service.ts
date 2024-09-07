import {Injectable, inject} from "@angular/core";
import { HttpClient, HttpContext } from "@angular/common/http";
import {environment} from "../../environments/environment";
import {firstValueFrom} from "rxjs";
import {Course} from "../models/course.model";
import {GetCoursesResponse} from "../models/get-courses.response";
import { SkipLoading } from "../loading/skip-loading.component";


@Injectable({
  providedIn: "root"
})
export class CoursesService {
  
  env = environment;

  http = inject(HttpClient);

  async loadAllCourses(): Promise<Course[]> {

    const courses$ = this.http.get<GetCoursesResponse>(`${this.env.apiRoot}/courses`, 
      {
        context: new HttpContext().set(SkipLoading, true)
      }
    );

    const payload = await firstValueFrom(courses$);

    return payload.courses;
  }

  async createCourse(course: Partial<Course>): Promise<Course> {

    const course$ = this.http.post<Course>(`${this.env.apiRoot}/courses`, course)

    return  firstValueFrom(course$);
  }

  async saveCourse(courseId: string, changes: Partial<Course>): Promise<Course> {

    const course$ = this.http.put<Course>(`${this.env.apiRoot}/courses/${courseId}`, changes)

    return firstValueFrom(course$);
  }

  async deleteCourse(courseId: string): Promise<Course> {

    const delete$ = this.http.delete<Course>(`${this.env.apiRoot}/courses/${courseId}`)

    // await is not necessary because it is not wrapped in try catch block
    return  firstValueFrom(delete$);
  }





}
