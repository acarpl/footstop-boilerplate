import {makeAutoObservable} from "mobx";

export class UIStore {
  title = "Footstop";

  constructor() {
    makeAutoObservable(this);
  }

  changeTitle(newTitle: string) {
    this.title = newTitle;
  }
}
