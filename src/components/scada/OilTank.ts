import { dia, util } from "@joint/core";

const MIN_LIQUID_COLOR = "#FFD23F";
const step = 20;

export default class OilTank extends dia.Element {
  defaults() {
    return {
      ...super.defaults,
      type: "LiquidTank",
      size: {
      width: 160,
      height: 300
      },
      attrs: {
      root: {
        magnetSelector: "body"
      },
      legs: {
        fill: "none",
        stroke: "#350100",
        strokeWidth: 8,
        strokeLinecap: "round",
        d: "M 20 calc(h) l -5 10 M calc(w - 20) calc(h) l 5 10"
      },
      body: {
        stroke: "gray",
        strokeWidth: 4,
        x: 0,
        y: 0,
        width: "calc(w)",
        height: "calc(h)",
        rx: 120,
        ry: 10,
        fill: {
        type: "linearGradient" as "linearGradient",
        stops: [
          { offset: "0%", color: "gray" },
          { offset: "30%", color: "white" },
          { offset: "70%", color: "white" },
          { offset: "100%", color: "gray" }
        ]
        }
      },
      top: {
        x: 0,
        y: 20,
        width: "calc(w)",
        height: 20,
        fill: "none",
        stroke: "gray",
        strokeWidth: 2
      },
      label: {
        text: "Tank 1",
        textAnchor: "middle",
        textVerticalAnchor: "top",
        x: "calc(w / 2)",
        y: "calc(h + 10)",
        fontSize: 14,
        fontFamily: "sans-serif",
        fill: "#350100"
      },
      // Add panel attributes inside the tank
      panel: {
        ref: "body",
        refX: 30,
        refY: 40,
        width: 100,
        height: 230,
      }
      },
      ports: {
      groups: {
        pipes: {
        position: {
          name: "absolute",
          args: {
          x: "calc(w / 2)",
          y: "calc(h / 2)"
          }
        },
        markup: util.svg`
                <rect @selector="pipeBody" />
                <rect @selector="pipeEnd" />
              `,
        size: { width: 50, height: 30 },
        attrs: {
          portRoot: {
          magnetSelector: "pipeEnd"
          },
          pipeBody: {
          width: "calc(w)",
          height: "calc(h)",
          y: "calc(h / -2)",
          fill: {
            type: "linearGradient" as const,
            stops: [
            { offset: "0%", color: "gray" },
            { offset: "30%", color: "white" },
            { offset: "70%", color: "white" },
            { offset: "100%", color: "gray" }
            ],
            attrs: {
            x1: "0%",
            y1: "0%",
            x2: "0%",
            y2: "100%"
            }
          }
          },
          pipeEnd: {
          width: 10,
          height: "calc(h+6)",
          y: "calc(h / -2 - 3)",
          stroke: "gray",
          strokeWidth: 3,
          fill: "white"
          }
        }
        }
      },
      items: [
        {
        id: "left",
        group: "pipes",
        z: 0,
        attrs: {
          pipeBody: {
          x: "calc(-1 * w)"
          },
          pipeEnd: {
          x: "calc(-1 * w)"
          }
        }
        },
        {
        id: "right",
        group: "pipes",
        z: 0,
        attrs: {
          pipeEnd: {
          x: "calc(w - 10)"
          }
        }
        }
      ]
      }
    };
  }

  preinitialize() {
    this.markup = util.svg/* xml */ `
            <path @selector="legs"/>
            <rect @selector="body"/>
            <rect @selector="top"/>
            <text @selector="label" />
        `;
  }

  get level() {
    return this.get("level") || 0;
  }

  set level(level) {
    const newLevel = Math.max(0, Math.min(100, level));
    this.set("level", newLevel);
  }
}


export class Panel extends dia.Element {
    public  level:Number =0
  defaults() {
    return {
      ...super.defaults,
      type: "Panel",
      size: {
        width: 100,
        height: 230
      },
      level: this.level,
      attrs: {
        root: {
            magnetSelector: "panelBody",
            pointerEvents:"none"
        },
        panelBody: {
          x: 0,
          y: 0,
          width: "calc(w)",
          height: "calc(h)",
          rx: 1,
          ry: 1,
          fill: "lightgray",
          stroke: "gray",
          strokeWidth: 1
        },
        panelWindow: {
          // turn the panel over so that we can grow the liquid from the bottom
          // by increasing the height of the bar.
          transform: "translate(10, 10) rotate(180) translate(-40,-205)"
        },
        panelTicks: {
          transform: "translate(55, 15)",
          d: `M 0 0 h 8 M 0 ${step} h 8 M 0 ${step * 2} h 8 M 0 ${
            step * 3
          } h 8 M 0 ${step * 4} h 8 M 0 ${step * 5} h 8 M 0 ${
            step * 6
          } h 8 M 0 ${step * 7} h 8 M 0 ${step * 8} h 8 M 0 ${
            step * 9
          } h 8 M 0 ${step * 10} h 8`,
          fill: "none",
          stroke: "black",
          strokeWidth: 2,
          strokeLinecap: "round"
        },
        panelValues: {
          text: "100\n90\n80\n70\n60\n50\n40\n30\n20\n10\n0",
          textAnchor: "middle",
          textVerticalAnchor: "top",
          x: 80,
          y: 10,
          lineHeight: step,
          fontSize: 14,
          fontFamily: "sans-serif"
        },
        frame: {
          width: 40,
          height: 200,
          rx: 1,
          ry: 1,
          fill: "none",
          stroke: "black",
          strokeWidth: 3
        },
        liquid: {
          x: 0,
          y: 0,
          width: 40,
          height: 0,
          stroke: "black",
          strokeWidth: 2,
          strokeOpacity: 0.2,
          fill: MIN_LIQUID_COLOR
        },
        glass: {
          x: 0,
          y: 0,
          width: 40,
          height: 200,
          fill: "blue",
          stroke: "none",
          fillOpacity: 0.1
        },
        label: {
          text: "Tank 1",
          textAnchor: "middle",
          textVerticalAnchor: "top",
          x: "calc(w / 2)",
          y: "calc(h + 10)",
          fontSize: 20,
          fontFamily: "sans-serif",
          fill: "#350100"
        }
      }
    };
  }

  preinitialize() {
    this.markup = util.svg/* xml */ `
            <rect @selector="panelBody"/>
            <path @selector="panelTicks"/>
            <text @selector="panelValues" />
            <g @selector="panelWindow">
                <rect @selector="glass"/>
                <rect @selector="liquid"/>
                <rect @selector="frame"/>
            </g>
      `;
  }
}