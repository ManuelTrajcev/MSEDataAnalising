import graph from '../images/graph.png';
import TimeSeriesGraph from "../components/TimeSeriesChart";
import TimeSeriesContainer from "../components/TimeSeriesContainer";

export default function Visualise() {
    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
             <TimeSeriesContainer/>
        </div>


    )
}