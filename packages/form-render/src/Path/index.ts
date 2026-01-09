const HYPHEN = "$hyphen$";
class Path {
  path: string[];
  key: string;
  isConnect = false
  static pathMapping: Record<string, Path> = {};
  constructor(path: string[]) {
    this.path = path;
    this.key = Path.parse(path);
    this.init();
  }

  static getPath(path: string[]) {
    const p = Path.parse(path);
    return Path.pathMapping[p];
  }

  static parse(path: string[]) {
    const key = path.join(HYPHEN);
    return key;
  }

  static revert(p: string) {
    return p.split(HYPHEN);
  }

  init() {
    const key = this.key;
    Path.pathMapping[key] = this;
  }
}

export default Path;
