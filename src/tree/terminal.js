export class Terminal {
  static ID = 0;
  constructor(value, kind) {
    let self = this;

    self.title = value;
    //get new id
    Terminal.ID = Terminal.ID + 1;
    self.kind = kind || "terminal";
    self.id = self.kind + "." + Terminal.ID;
    self._nodes = [value];
    self._start = this;
    self._finish = this;
  }

  get start() {
    return this._start;
  }

  get finish() {
    return this._finish;
  }

  get children() {
    return this._nodes;
  }

  static getName(name, obj) {
    obj.title = name;
    return obj;
  }

  foundNode(node) {
    return this.id === node.id;
  }

  accept(visitor,filter){
    return visitor.visit(this,filter);
  }

}

export class NonTerminal extends Terminal {
  constructor(_nodes, type) {
    super(_nodes, type);
    let self = this;
    self._nodes = [];
    self.title = null;
    self._start = new Terminal("start", "start");
    self._finish = new Terminal("finish", "finish");

    if (Array.isArray(_nodes)) {
      let val = _nodes.map(n => {
        if (n instanceof Function) {
          return Terminal.getName(n.name, n.call());
        } else if (typeof n === "string") {
          return terminal(n);
        }
        return n;
      });
      self._nodes = val;
    } else {
      if (_nodes instanceof Function) {
        console.log(_nodes.name);
        self._nodes.push(Terminal.getName(_nodes.name, _nodes.call()));
      } else {
        if (typeof _nodes === "string") {
          self._nodes.push(terminal(_nodes));
        } else {
          self._nodes.push(_nodes);
        }
      }
    }
    if (this.title === null) {
      this.title = "" + this.id;
    }
  }
  foundNode(node) {
    return this._nodes.filter(n => n.id === node.id).length > 0;
  }
}

export function terminal(elt) {
  return new Terminal(elt);
}