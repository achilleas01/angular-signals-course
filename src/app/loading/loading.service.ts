import {Injectable, signal} from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LoadingService {

  #loadingSignal = signal(false);

  loading = this.#loadingSignal.asReadonly();

  loadingOn() {
    this.#loadingSignal.set(true);
  }

  loadingOff() {
    this.#loadingSignal.set(false);
  }

}
