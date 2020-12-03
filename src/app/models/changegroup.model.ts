export interface ChangeGroupJson {
  id: number;
  name: string;
  // users: EmployeeJson[];
}

export class ChangeGroup {
  private ID: number;
  private _CHECKED = false;

  constructor(
    private NAME: string,
    // private USERS: Employee[]
  ) {
  }

  static fromJSON(json: ChangeGroupJson): ChangeGroup {
    if (json !== null) {
      const changegroup = new ChangeGroup(
        json.name,
        // json.users.map(Employee.fromJSON)
      );
      changegroup.ID = json.id;
      return changegroup;
    }
    return null as ChangeGroup;
  }

  toJSON(): ChangeGroupJson {
    // @ts-ignore
    return {
      name: this.NAME,
      // users: this.USERS
    } as ChangeGroupJson;
  }

  get id(): number {
    return this.ID;
  }

  get name(): string {
    return this.NAME;
  }

  get CHECKED(): boolean {
    return this._CHECKED;
  }

  set CHECKED(value: boolean) {
    this._CHECKED = value;
  }

  /*get users(): Employee[]{
      return this.USERS;
    }*/
}
