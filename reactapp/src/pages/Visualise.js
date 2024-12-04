import graph from '../images/graph.png';

export default function Visualise() {
    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            <h1>Тренд и сезоналност</h1>
            <img src={graph} alt="Graphic"/>
        </div>
    )
}