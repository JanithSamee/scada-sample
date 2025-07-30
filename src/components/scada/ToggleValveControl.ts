import { dia, util } from "@joint/core";

export default class ToggleValve extends dia.Element {
  defaults() {
    return {
      ...super.defaults,
      type: "ToggleValve",
      size: { width: 100, height: 100 },
      open: false,
      attrs: {
        body: {
          cx: "calc(w/2)",
          cy: "calc(h/2)",
          rx: "calc(w/2)",
          ry: "calc(h/2)",
          stroke: "gray",
          strokeWidth: 2,
          fill: {
            type: "radialGradient" as const,
            stops: [
              { offset: "70%", color: "white" },
              { offset: "100%", color: "gray" }
            ]
          }
        },
       
      }
    };
  }

  preinitialize() {
    this.markup = util.svg/* xml */ `
      <foreignObject width="100" height="50" x="0" y="calc(h)">
        <div class="jj-switch" xmlns="http://www.w3.org/1999/xhtml">
          <button @selector="buttonOn" class="jj-switch-on">open</button>
          <button @selector="buttonOff" class="jj-switch-off">close</button>
        </div>
      </foreignObject>
    `;
  }

  initialize() {
    super.initialize();

    // Listen to changes in "open"
    this.on("change:open", this.updateSwitch, this);

    // Initialize state
    // this.updateSwitch()

    // Attach DOM events after rendering
    this.on("change:attrs", this.bindEvents, this);
  }

  bindEvents(graph:any) {
    const view = graph;
    if (!view) return;
    const { childNodes } = view;

    if (childNodes.buttonOn && !childNodes.buttonOn._bound) {
      childNodes.buttonOn.addEventListener("click", () => this.toggleOpen());
      childNodes.buttonOn._bound = true;
    }
    if (childNodes.buttonOff && !childNodes.buttonOff._bound) {
      childNodes.buttonOff.addEventListener("click", () => this.toggleOpen());
      childNodes.buttonOff._bound = true;
    }
  }

  toggleOpen() {
    const isOpen = this.get("open");
    this.set("open", !isOpen);
  }

  updateSwitch(graph:any) {
    const isOpen = this.get("open");
    const view = graph;
    if (!view) return;
    const { childNodes } = view;
    if (childNodes.buttonOn && childNodes.buttonOff) {
      childNodes.buttonOn.disabled = isOpen;
      childNodes.buttonOff.disabled = !isOpen;
    }
    if (childNodes.switchLabel) {
      childNodes.switchLabel.textContent = isOpen ? "Valve is Open" : "Valve is Closed";
    }
  }
}
