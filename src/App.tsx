import { dia, shapes } from "@joint/core";
import { useEffect, useRef } from "react"
import Valve from "./components/scada/Valve";
import OilTank from "./components/scada/OilTank";
import PipeLink from "./components/scada/PipeLink";
import ToggleValve from "./components/scada/ToggleValveControl";

function App() {
  const scadaView = useRef<HTMLDivElement>(null);
   const namespace = {
		...shapes,
   };

   


  useEffect(() => {
    const graph = new dia.Graph({}, { cellNamespace: namespace });

	  const paper = new dia.Paper({
		model: graph,
		background: { color: "#F5F5F5" },
		height: "100vh",
		width: "100vw",
		cellViewNamespace: namespace,
	});
   
    scadaView.current?.appendChild(paper.el);
    

    // ----- Components -----
    const valve = new Valve()
    valve.addTo(graph);
    valve.position(400,100)
    valve.attr("label/text", "Hand Valve");

    const oilTank01 = new OilTank({attrs: { label: { text: "Tank 1" } } });
    oilTank01.addTo(graph);
    oilTank01.position(100, 100);


    const oilTank02 = new OilTank({attrs: { label: { text: "Tank 2" } } })
    oilTank02.addTo(graph);
    oilTank02.position(600, 100);

    // ----- valve Control -----

    const toggle1 = new ToggleValve()
    toggle1.position(400, 300);
    toggle1.addTo(graph);  
      

    // ----- Pump Links  -----
    const t1Tvalve = new PipeLink();

    t1Tvalve.source(oilTank01, { port: "right" });
    t1Tvalve.target(valve, { port: "left" });
    t1Tvalve.runFlow();
    t1Tvalve.addTo(graph);
   
   
    const valveTt2 = new PipeLink();

    valveTt2.source(valve, { port: "right" });
    valveTt2.target(oilTank02, { port: "left" });
    valveTt2.runFlow()
    valveTt2.stopFlow()
    valveTt2.addTo(graph);


    return () => {
      graph.clear();
      paper.remove();
    }
  }, [])
  
  return (
   <div>
    <div ref={scadaView}></div>
   </div>
  )
}

export default App