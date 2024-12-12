import DataTable from "../components/DataTable";

export default function ShowData() {
    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            <h1>Историски податоци за издавачи</h1>
            <DataTable companyCode="KMB"/>
        </div>

    )

}