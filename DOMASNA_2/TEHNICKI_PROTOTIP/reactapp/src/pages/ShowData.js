import DataTable from "../components/DataTable";

export default function ShowData() {
    const scrapeData = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/my-function/');
            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
            } else {
                console.error('Failed to call the API');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            <h1>Историски податоци за издавачи</h1>
            <DataTable companyCode="KMB"/>
        </div>

    )

}