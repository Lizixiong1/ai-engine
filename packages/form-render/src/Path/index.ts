const HYPHEN = ".";
class Path {
  path: string[];
  key: string;
  constructor(path: string[]) {
    this.path = path;
    this.key = Path.parse(path);
  }

  static parse(path: string[]) {
    return path.join(HYPHEN);
  }

  static revert(p: string) {
    return p.split(HYPHEN);
  }
}

export default Path;
